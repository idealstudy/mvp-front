'use client';

import React, { useEffect } from 'react';
import { FieldPath, FormProvider, useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { useUpdateTeacherOnboarding } from '@/features/dashboard/hooks/use-update-onboarding';
import {
  CreateStudyRoomSchema,
  teacherStudyRoomQueryOptions,
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
import {
  ConfirmDialog,
  dialogReducer,
  initialDialogState,
} from '@/shared/components/dialog';
import { Form } from '@/shared/components/ui/form';
import { trackStudyroomCreateSuccess } from '@/shared/lib/gtm/trackers';
import { useMemberStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';

export const ORDER = ['basic', 'profile'] as const;
export type Step = (typeof ORDER)[number];
type StudyRoomFlowProps = {
  mode: 'create' | 'edit';
  initialValues?: Partial<StudyRoomFormValues>;
  studyRoomId?: number;
};

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

export default function StudyRoomFlow({
  mode,
  initialValues,
  studyRoomId,
}: StudyRoomFlowProps) {
  const router = useRouter();
  const [state, dispatch] = React.useReducer(
    stepperReducer,
    createStepState([...ORDER] as Step[])
  );

  const [dialog, dialogDispatch] = React.useReducer(
    dialogReducer,
    initialDialogState
  );

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
      characteristic: '',
      visibility: 'PUBLIC',
      modality: undefined,
      classForm: undefined,
      subjectType: undefined,
      schoolInfo: {
        schoolLevel: undefined,
        grade: undefined as unknown as number,
      },
      ...initialValues,
    },
  });

  const { data } = useQuery({
    ...teacherStudyRoomQueryOptions.teacherDetail(studyRoomId!),
    enabled: mode === 'edit' && !!studyRoomId,
  });

  useEffect(() => {
    if (mode !== 'edit' || !data) return;

    methods.reset({
      name: data.name ?? '',
      description: data.description ?? '',
      characteristic: data.characteristic ?? '',
      visibility: data.visibility,
      modality: data.modality === 'HYBRID' ? 'ONLINE' : data.modality,
      classForm: data.classForm === 'GROUP' ? 'ONE_TO_MANY' : 'ONE_ON_ONE',
      subjectType: data.subjectType as StudyRoomFormValues['subjectType'],
      schoolInfo: {
        schoolLevel: data.schoolInfo
          .schoolLevel as StudyRoomFormValues['schoolInfo']['schoolLevel'],
        grade: data.schoolInfo.grade,
      },
    });
  }, [mode, data, methods]);

  void mode;
  void studyRoomId;

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

  const buildNextRoute = (id: number, condition: 'invite' | 'dashboard') =>
    condition === 'invite'
      ? `/study-rooms/${id}/note?invite=open`
      : `/study-rooms/${id}/note`;

  const handleSubmitCondition = React.useCallback(
    (condition: 'invite' | 'dashboard') => {
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
            router.replace(buildNextRoute(result.id, condition));
          },
        });
      })();
    },
    [isPending, methods, mutate, router, session, sendOnboarding]
  );

  // TODO: 수정 버튼 연결
  const onConfirmClick = () => {
    alert('수정끝');
  };

  return (
    <section className="flex flex-col">
      <div className="mx-auto w-fit">
        <ProgressIndicator
          current={state.index}
          max={state.maxValidatedIndex}
          onMove={handleIndicatorMove}
        />
        <h2 className="mt-8 text-center text-4xl font-semibold">
          스터디룸 기본 정보
        </h2>
      </div>
      {mode === 'edit' && (
        <p className="font-body1-heading text-orange-7 flex justify-end">
          수정
        </p>
      )}
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
              mode={mode}
              disabled={isPending}
              onRequestSubmit={() =>
                dialogDispatch({
                  type: 'OPEN',
                  scope: 'studyroom',
                  kind: 'onConfirm',
                })
              }
              onRequestEdit={() =>
                dialogDispatch({
                  type: 'OPEN',
                  scope: 'studyroom',
                  kind: 'onConfirm',
                })
              }
              onCancel={() =>
                dialogDispatch({
                  type: 'OPEN',
                  scope: 'studyroom',
                  kind: 'cancel',
                })
              }
            />
          )}
        </Form>
      </FormProvider>

      {mode === 'create' &&
        dialog.status === 'open' &&
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
        )}

      {mode === 'edit' &&
        dialog.status === 'open' &&
        dialog.scope === 'studyroom' &&
        dialog.kind === 'onConfirm' && (
          <ConfirmDialog
            open
            dispatch={dialogDispatch}
            variant="confirm-cancel"
            title="수정하시겠습니까?"
            description="수정이 완료되면 프리뷰 페이지로 돌아갑니다."
            confirmText="확인"
            cancelText="취소"
            onConfirm={onConfirmClick}
            pending={isPending}
          />
        )}
      {mode === 'edit' &&
        dialog.status === 'open' &&
        dialog.scope === 'studyroom' &&
        dialog.kind === 'cancel' && (
          <ConfirmDialog
            open
            dispatch={dialogDispatch}
            variant="confirm-cancel"
            title="수정 내용을 취소할까요?"
            description="취소하면 이전 페이지로 이동하며 변경사항은 저장되지 않습니다."
            confirmText="나가기"
            cancelText="계속 수정"
            onConfirm={() => router.back()}
          />
        )}
    </section>
  );
}
