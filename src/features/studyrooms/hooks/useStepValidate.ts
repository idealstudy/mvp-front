import { UseFormReturn, useWatch } from 'react-hook-form';

import {
  Step,
  fieldsPerStep,
} from '@/features/studyrooms/components/create/CreateStudyRoomFlow';
import { StudyRoomFormValues } from '@/features/studyrooms/schemas/create';

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
