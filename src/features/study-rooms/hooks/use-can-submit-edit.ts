import { Control, useWatch } from 'react-hook-form';

import { StudyRoomDetail, StudyRoomFormValues } from '@/features/study-rooms';
import {
  parseEditorContent,
  prepareContentForSave,
} from '@/shared/components/editor';

type UseCanSubmitEditParams = {
  control: Control<StudyRoomFormValues>;
  mode: 'create' | 'edit';
  data?: StudyRoomDetail;
  initialCharacteristic: StudyRoomFormValues['characteristic'];
};

export const serializeCharacteristic = (value: unknown) => {
  const parsed = parseEditorContent(
    typeof value === 'string' ? value : JSON.stringify(value ?? '')
  );
  const { contentString } = prepareContentForSave(parsed);
  return contentString;
};

export const normalizeModalityToForm = (
  modality: string | undefined
): StudyRoomFormValues['modality'] | undefined => {
  if (!modality) return undefined;
  return modality === 'OFFLINE' ? 'OFFLINE' : 'ONLINE';
};

export const normalizeClassFormToForm = (
  classForm: string | undefined
): StudyRoomFormValues['classForm'] | undefined => {
  if (!classForm) return undefined;
  return classForm === 'ONE_ON_ONE' ? 'ONE_ON_ONE' : 'ONE_TO_MANY';
};

export const useCanSubmitEdit = ({
  control,
  mode,
  data,
  initialCharacteristic,
}: UseCanSubmitEditParams) => {
  const watchedValues = useWatch({ control });

  if (mode !== 'edit' || !data) {
    return false;
  }

  return (
    (watchedValues.name ?? '') !== (data.name ?? '') ||
    (watchedValues.description ?? '') !== (data.description ?? '') ||
    serializeCharacteristic(watchedValues.characteristic) !==
      serializeCharacteristic(initialCharacteristic) ||
    watchedValues.visibility !== data.visibility ||
    normalizeModalityToForm(watchedValues.modality) !==
      normalizeModalityToForm(data.modality) ||
    normalizeClassFormToForm(watchedValues.classForm) !==
      normalizeClassFormToForm(data.classForm) ||
    watchedValues.subjectType !== data.subjectType ||
    watchedValues.schoolInfo?.schoolLevel !== data.schoolInfo.schoolLevel ||
    watchedValues.schoolInfo?.grade !== data.schoolInfo.grade
  );
};
