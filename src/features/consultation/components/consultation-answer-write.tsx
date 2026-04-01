'use client';

import { Controller, useForm } from 'react-hook-form';

import { ConsultationDetail, consultationKeys } from '@/entities/consultation';
import {
  useCreateConsultationAnswer,
  useUpdateConsultationAnswer,
} from '@/features/consultation/hooks/use-answer-form';
import { useTeacherProfile } from '@/features/consultation/hooks/use-teacher-profile';
import {
  ConsultationAnswerForm,
  ConsultationAnswerFormSchema,
} from '@/features/consultation/schema/schema';
import {
  TextEditor,
  initialTextEditorValue,
  parseEditorContent,
  prepareContentForSave,
} from '@/shared/components/editor';
import { Button, Form } from '@/shared/components/ui';
import { cn, extractText } from '@/shared/lib';
import { classifyConsultationError, handleApiError } from '@/shared/lib/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';

export default function ConsultationAnswerWrite({
  consultation,
  isEditMode = false,
  onCancel,
}: {
  consultation: ConsultationDetail;
  isEditMode?: boolean;
  onCancel?: () => void;
}) {
  const queryClient = useQueryClient();

  const { data: teacherProfile } = useTeacherProfile(
    consultation.targetTeacherId
  );

  const createConsultationAnswerMutation = useCreateConsultationAnswer(
    consultation.id
  );
  const updateConsultationAnswerMutation = useUpdateConsultationAnswer(
    consultation.id,
    onCancel
  );
  const mutation = isEditMode
    ? updateConsultationAnswerMutation
    : createConsultationAnswerMutation;

  // 수정 모드일 경우, 초기값 세팅
  const initialContent =
    isEditMode && consultation.answer
      ? parseEditorContent(consultation.answer.resolvedContent.content)
      : initialTextEditorValue;

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
  } = useForm<ConsultationAnswerForm>({
    resolver: zodResolver(ConsultationAnswerFormSchema),
    defaultValues: { content: initialContent },
    mode: 'onChange',
  });

  const onSubmit = (data: ConsultationAnswerForm) => {
    const { contentString, mediaIds } = prepareContentForSave(data.content);
    mutation.mutate(
      { content: contentString, mediaIds },
      {
        onError: (error) => {
          handleApiError(error, classifyConsultationError, {
            // INQUIRY_ANSWER_ALREADY_EXISTS, INQUIRY_NOT_FOUND, INQUIRY_ANSWER_NOT_FOUND, INQUIRY_ANSWER_FORBIDDEN
            onContext: () =>
              queryClient.invalidateQueries({
                queryKey: consultationKeys.detail(consultation.id),
              }),
          });
        },
      }
    );
  };

  return (
    <div className="border-line-line1 mt-4 h-fit w-full rounded-xl border bg-white px-8 py-10">
      <div className="flex flex-col gap-5">
        {/* 프로필 */}
        <div className="flex flex-row items-center gap-3">
          <div className="bg-gray-scale-gray-10 h-10 w-10 rounded-full" />
          <span className="font-body2-heading">
            {teacherProfile?.name ? `${teacherProfile.name} 선생님` : null}
          </span>
        </div>

        {/* 답변 작성 폼 */}
        <Form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Controller
            name="content"
            control={control}
            render={({ field }) => {
              const text = extractText(JSON.stringify(field.value));
              const length = text.length;
              return (
                <>
                  <TextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="답변을 입력해주세요."
                    minHeight="400px"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-system-warning text-sm">
                      {typeof errors.content?.message === 'string' &&
                        errors.content.message}
                    </p>
                    <span
                      className={cn(
                        length > 3000 ? 'text-system-warning' : 'text-gray-5'
                      )}
                    >
                      {length} / 3000
                    </span>
                  </div>
                </>
              );
            }}
          />
          <div className="flex items-center justify-end gap-2">
            {isEditMode && onCancel && (
              <Button
                type="button"
                variant="outlined"
                onClick={onCancel}
                disabled={mutation.isPending}
                size="small"
              >
                취소
              </Button>
            )}
            <Button
              type="submit"
              disabled={mutation.isPending || !isDirty || !isValid}
              size="small"
            >
              {mutation.isPending && '저장 중'}
              {!mutation.isPending && (isEditMode ? '답변 수정' : '답변 등록')}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
