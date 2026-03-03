'use client';

import React from 'react';
import { FieldPath, FormProvider, useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { useUpdateTeacherOnboarding } from '@/features/dashboard/hooks/use-update-onboarding';
import {
  CreateStudyRoomSchema,
  useCreateStudyRoom,
} from '@/features/study-rooms';
import type { StudyRoomFormValues } from '@/features/study-rooms';
import ProgressIndicator from '@/features/study-rooms/components/create/ProgressIndicator';
import StepOne from '@/features/study-rooms/components/create/StepOne';
import StepTwo from '@/features/study-rooms/components/create/StepTwo';
import { useStepValidate } from '@/features/study-rooms/hooks/useStepValidate';
import {
  StepState,
  createStepState,
  stepperReducer,
} from '@/features/study-rooms/hooks/useStepperReducer';
// import {
//   ConfirmDialog,
//   dialogReducer,
//   initialDialogState,
// } from '@/shared/components/dialog';
import { Form } from '@/shared/components/ui/form';
import { trackStudyroomCreateSuccess } from '@/shared/lib/gtm/trackers';
import { useMemberStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';

export const ORDER = ['basic', 'profile'] as const;
export type Step = (typeof ORDER)[number];

/**
 * - basic : 스터디룸의 메타데이터
 * - profile : 스터디룸이 어떤 수업을 위한 것인지 설명하는 교육 프로필
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
};

export default function CreateStudyRoomFlow() {
  const router = useRouter();
  const [state, dispatch] = React.useReducer(
    stepperReducer,
    createStepState([...ORDER] as Step[])
  );

  // const [dialog, dialogDispatch] = React.useReducer(
  //   dialogReducer,
  //   initialDialogState
  // );

  const { sendOnboarding } = useUpdateTeacherOnboarding('CREATE_STUDY_ROOM');

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
  const { mutate, isPending } = useCreateStudyRoom();
  const session = useMemberStore((s) => s.member);

  const handleNext = async () => {
    const names = fieldsPerStep[step];
    const ok = await methods.trigger(names, { shouldFocus: true });
    if (!ok) return;

    dispatch({ type: 'MARK_VALIDATED', upTo: state.index + 1 });
    dispatch({ type: 'NEXT' });
  };

  const handleIndicatorMove = (to: number) => dispatch({ type: 'GO', to });

  // const buildNextRoute = (id: number, condition: 'invite' | 'dashboard') =>
  //   condition === 'invite'
  //     ? `/study-rooms/${id}/note?invite=open`
  //     : `/study-rooms/${id}/note`;

  // const handleSubmitCondition = React.useCallback(
  //   (condition: 'invite' | 'dashboard') => {
  //     if (isPending) return;
  //     methods.handleSubmit((data: StudyRoomFormValues) => {
  //       mutate(data, {
  //         onSuccess: (result) => {
  //           // 스터디룸 생성 성공 이벤트
  //           trackStudyroomCreateSuccess(
  //             {
  //               user_id: session?.id ?? 0,
  //               title_length: data.name?.length ?? 0,
  //               description_length: data.description?.length ?? 0,
  //             },
  //             session?.role ?? null
  //           );
  //           // 스펙상 id는 항상 옴 (fallback은 의도적으로 생략)
  //           sendOnboarding(); // 온보딩 반영
  //           router.replace(buildNextRoute(result.id, condition));
  //         },
  //       });
  //     })();
  //   },
  //   [isPending, methods, mutate, router, session, sendOnboarding]
  // );

  const handleSubmit = React.useCallback(() => {
    if (isPending) return;
    methods.handleSubmit((data: StudyRoomFormValues) => {
      mutate(data, {
        onSuccess: (result) => {
          // 스터디룸 생성 성공 이벤트
          trackStudyroomCreateSuccess(
            {
              user_id: session?.id ?? 0,
              title_length: data.name?.length ?? 0,
              description_length: data.description?.length ?? 0,
            },
            session?.role ?? null
          );
          // 스펙상 id는 항상 옴 (fallback은 의도적으로 생략)
          sendOnboarding(); // 온보딩 반영
          router.replace(`/study-rooms/${result.id}/note`);
        },
      });
    })();
  }, [isPending, methods, mutate, router, session, sendOnboarding]);

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
          onSubmit={(e) => e.preventDefault()}
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
              disabled={isPending}
              // onRequestSubmit={() =>
              //   dialogDispatch({
              //     type: 'OPEN',
              //     scope: 'studyroom',
              //     kind: 'onConfirm',
              //   })
              // }
              onRequestSubmit={handleSubmit}
            />
          )}
        </Form>
      </FormProvider>

      {/* {dialog.status === 'open' &&
        dialog.scope === 'studyroom' &&
        dialog.kind === 'onConfirm' && (
          <ConfirmDialog
            open
            dispatch={dialogDispatch}
            variant="confirm-cancel"
            title="학생을 지금 초대하시겠어요?"
            description="지금 초대하면 초대 화면으로, 나중에 하시면 스터디룸으로 이동합니다."
            confirmText="지금 초대하기"
            cancelText="나중에 할게요"
            pending={isPending}
            onConfirm={() => handleSubmitCondition('invite')}
            onCancel={() => handleSubmitCondition('dashboard')}
          />
        )} */}
    </section>
  );
}
