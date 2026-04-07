'use client';

import React, { useEffect } from 'react';
import { FieldPath, FormProvider, useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { previewKeys } from '@/entities/study-room-preview';
import { useUpdateTeacherOnboarding } from '@/features/dashboard/hooks/use-update-onboarding';
import {
  CreateStudyRoomSchema,
  StudyRoomsQueryKey,
  teacherStudyRoomQueryOptions,
  useCreateStudyRoom,
} from '@/features/study-rooms';
import type {
  StudyRoomFormValues,
  StudyRoomSubmitValues,
} from '@/features/study-rooms';
import ProgressIndicator from '@/features/study-rooms/components/create/ProgressIndicator';
import StepOne from '@/features/study-rooms/components/create/StepOne';
import StepTwo from '@/features/study-rooms/components/create/StepTwo';
import {
  normalizeClassFormToForm,
  normalizeModalityToForm,
  serializeCharacteristic,
  useCanSubmitEdit,
} from '@/features/study-rooms/hooks/use-can-submit-edit';
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
import {
  mergeResolvedContentWithMediaIds,
  parseEditorContent,
} from '@/shared/components/editor';
import { Form } from '@/shared/components/ui/form';
import { classifyPreviewError, handleApiError } from '@/shared/lib/errors';
import { trackStudyroomCreateSuccess } from '@/shared/lib/gtm/trackers';
import { useMemberStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useUpdateStudyRoom } from '../sidebar/services/query';

export const ORDER = ['basic', 'profile'] as const;
export type Step = (typeof ORDER)[number];
type StudyRoomFlowProps = {
  mode: 'create' | 'edit';
  initialValues?: Partial<StudyRoomFormValues>;
  studyRoomId?: number;
};

const buildCharacteristicForEditor = (
  rawCharacteristic?: string,
  resolvedCharacteristic?: string
) => {
  const rawContent = parseEditorContent(rawCharacteristic ?? '');

  if (!resolvedCharacteristic) {
    return rawContent;
  }

  const resolvedContent = parseEditorContent(resolvedCharacteristic);
  return mergeResolvedContentWithMediaIds(rawContent, resolvedContent);
};

/**
 * - basic : 스터디룸의 메타데이터
 * - profile : 스터디룸이 어떤 수업을 위한 것인지 설명하는 교육 프로필
 **/
export const fieldsPerStep: Record<Step, FieldPath<StudyRoomFormValues>[]> = {
  basic: ['name', 'visibility', 'description', 'characteristic'],
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
  const queryClient = useQueryClient();
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
      characteristic: parseEditorContent(''),
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
      characteristic: buildCharacteristicForEditor(
        data.characteristic,
        data.resolvedContent?.content ?? ''
      ),
      visibility: data.visibility,
      modality: normalizeModalityToForm(data.modality),
      classForm: normalizeClassFormToForm(data.classForm),
      subjectType: data.subjectType as StudyRoomFormValues['subjectType'],
      schoolInfo: {
        schoolLevel: data.schoolInfo
          .schoolLevel as StudyRoomFormValues['schoolInfo']['schoolLevel'],
        grade: data.schoolInfo.grade ?? undefined,
      },
    });
  }, [mode, data, methods]);

  void mode;
  void studyRoomId;

  const { isStepValid } = useStepValidate(methods, step);
  const { mutate: createStudyRoomMutate, isPending: creating } =
    useCreateStudyRoom();
  const { mutate: updateStudyRoom, isPending: updating } = useUpdateStudyRoom();

  const session = useMemberStore((s) => s.member);
  const isMutating = creating || updating;
  const initialCharacteristic: StudyRoomFormValues['characteristic'] =
    mode !== 'edit' || !data
      ? parseEditorContent('')
      : buildCharacteristicForEditor(
          data.characteristic,
          data.resolvedContent?.content ?? ''
        );
  const canSubmitEdit = useCanSubmitEdit({
    control: methods.control,
    mode,
    data,
    initialCharacteristic,
  });

  const handleNext = async () => {
    const names = fieldsPerStep[step];
    const ok = await methods.trigger(names, { shouldFocus: true });
    if (!ok) return;

    dispatch({ type: 'MARK_VALIDATED', upTo: state.index + 1 });
    dispatch({ type: 'NEXT' });
  };

  const handleIndicatorMove = (to: number) => dispatch({ type: 'GO', to });

  const handleSubmit = React.useCallback(() => {
    if (creating) return;
    methods.handleSubmit((data: StudyRoomFormValues) => {
      const payload: StudyRoomSubmitValues = {
        ...data,
        characteristic: serializeCharacteristic(data.characteristic),
      };

      createStudyRoomMutate(payload, {
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
  }, [
    creating,
    methods,
    createStudyRoomMutate,
    router,
    session,
    sendOnboarding,
  ]);

  const onConfirmClick = React.useCallback(() => {
    if (updating || !studyRoomId || !data) return;

    methods.handleSubmit((formValues: StudyRoomFormValues) => {
      const payload: StudyRoomSubmitValues = {
        name: formValues.name,
        description: formValues.description,
        characteristic: serializeCharacteristic(formValues.characteristic),
        visibility: formValues.visibility,
        modality: formValues.modality,
        classForm: formValues.classForm,
        subjectType: formValues.subjectType,
        schoolInfo: {
          schoolLevel: formValues.schoolInfo.schoolLevel,
          grade: formValues.schoolInfo.grade ?? data.schoolInfo.grade,
        },
      };

      updateStudyRoom(
        { studyRoomId, others: payload },
        {
          onSuccess: async () => {
            queryClient.removeQueries({
              queryKey: previewKeys.main(studyRoomId),
            });
            queryClient.removeQueries({
              queryKey: previewKeys.side(data.teacherId, studyRoomId),
            });
            queryClient.removeQueries({
              queryKey: StudyRoomsQueryKey.detail(studyRoomId),
            });
            methods.reset(formValues);
            router.replace(
              `/study-room-preview/${studyRoomId}/${data.teacherId}`
            );
          },
          onError: (error) => {
            handleApiError(error, classifyPreviewError, {
              onAuth: () => {
                setTimeout(() => {
                  router.replace('/login');
                }, 1500);
              },

              onContext: () => {
                setTimeout(() => {
                  router.replace(
                    `/study-room-preview/${studyRoomId}/${data.teacherId}`
                  );
                }, 1500);
              },

              onUnknown: () => {},
            });
          },
        }
      );
    })();
  }, [
    updating,
    studyRoomId,
    data,
    methods,
    updateStudyRoom,
    queryClient,
    router,
  ]);

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
              disabled={isMutating}
              canSubmitEdit={canSubmitEdit}
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
              onRequestSubmit={handleSubmit}
            />
          )}
        </Form>
      </FormProvider>

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
            pending={isMutating}
            confirmButtonTestId="study-room-edit-confirm-button"
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
