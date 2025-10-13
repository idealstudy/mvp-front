'use client';

import React from 'react';
import { FieldPath, FormProvider, useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import ProgressIndicator from '@/features/studyrooms/components/create/ProgressIndicator';
import StepOne from '@/features/studyrooms/components/create/StepOne';
import StepThree from '@/features/studyrooms/components/create/StepThree';
import StepTwo from '@/features/studyrooms/components/create/StepTwo';
import { useStepValidate } from '@/features/studyrooms/hooks/useStepValidate';
import {
  StepState,
  createStepState,
  stepperReducer,
} from '@/features/studyrooms/hooks/useStepperReducer';
import {
  CreateStudyRoomSchema,
  StudyRoomFormValues,
} from '@/features/studyrooms/schemas/create';
import { useCreateStudyRoomMutation } from '@/features/studyrooms/services/query';
import { zodResolver } from '@hookform/resolvers/zod';

export const ORDER = ['basic', 'profile', 'invite'] as const;
export type Step = (typeof ORDER)[number];

/**
 * - basic : 스터디룸의 메타데이터
 * - profile : 스터디룸이 어떤 수업을 위한 것인지 설명하는 교육 프로필
 * - invite: 참여자
 **/
export const fieldsPerStep: Record<Step, FieldPath<StudyRoomFormValues>[]> = {
  basic: ['name', 'visibility', 'description'],
  profile: [
    'modality',
    'classForm',
    'subjectType',
    'schoolInfo.schoolLevel',
    'schoolInfo.grade',
  ],
  invite: ['emails'],
};

export default function CreateStudyRoomFlow() {
  const [state, dispatch] = React.useReducer(
    stepperReducer,
    createStepState([...ORDER] as Step[])
  );

  const getCurrentStep = (s: StepState) => s.order[s.index];
  const step = getCurrentStep(state)!;

  const methods = useForm<StudyRoomFormValues>({
    mode: 'onChange',
    resolver: zodResolver(CreateStudyRoomSchema),
    shouldUnregister: false,
    defaultValues: {
      name: '',
      description: '',
      visibility: 'PUBLIC',
      modality: undefined,
      classForm: undefined,
      subjectType: undefined,
      schoolInfo: {
        schoolLevel: undefined,
        grade: undefined as unknown as number,
      },
    },
  });

  const { isStepValid } = useStepValidate(methods, step);

  const handleNext = async () => {
    const names = fieldsPerStep[step];
    const ok = await methods.trigger(names, { shouldFocus: true });
    if (!ok) return;

    dispatch({ type: 'MARK_VALIDATED', upTo: state.index + 1 });
    dispatch({ type: 'NEXT' });
  };

  const handleIndicatorMove = (to: number) => dispatch({ type: 'GO', to });

  const { mutate, isPending } = useCreateStudyRoomMutation();

  const onSubmit = (data: StudyRoomFormValues) => mutate(data);

  return (
    <section className="flex flex-col">
      <div className="mx-auto w-fit">
        <ProgressIndicator
          current={state.index}
          max={state.maxValidatedIndex}
          onMove={handleIndicatorMove}
        />
        <h2 className="mt-8 text-center text-4xl font-semibold">
          스터디룸 만들기
        </h2>
      </div>
      <FormProvider {...methods}>
        <Form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="mt-12"
        >
          {step === 'basic' && (
            <StepOne
              onNext={handleNext}
              disabled={!isStepValid}
            />
          )}
          {step === 'profile' && (
            <StepTwo
              onNext={handleNext}
              disabled={!isStepValid}
            />
          )}
          {step === 'invite' && <StepThree disabled={isPending} />}
        </Form>
      </FormProvider>
    </section>
  );
}
