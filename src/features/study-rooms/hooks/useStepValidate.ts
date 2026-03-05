import { UseFormReturn, useWatch } from 'react-hook-form';

import {
  Step,
  fieldsPerStep,
} from '@/features/study-rooms/components/create/study-room-flow';
import { StudyRoomFormValues } from '@/features/study-rooms/model';

export const useStepValidate = (
  methods: UseFormReturn<StudyRoomFormValues>,
  step: Step
) => {
  const names = fieldsPerStep[step];
  useWatch({ control: methods.control, name: names });

  const isStepInvalid = names.some((n) => methods.getFieldState(n).invalid);
  const isStepValid = !isStepInvalid;

  return { isStepInvalid, isStepValid };
};
