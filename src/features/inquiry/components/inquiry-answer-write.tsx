'use client';

import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { InquiryDetail, inquiryKeys } from '@/entities/inquiry';
import {
  useCreateInquiryAnswer,
  useUpdateInquiryAnswer,
} from '@/features/inquiry/hooks/use-answer-form';
import { useTeacherProfile } from '@/features/inquiry/hooks/use-teacher-profile';
import {
  InquiryAnswerForm,
  InquiryAnswerFormSchema,
} from '@/features/inquiry/schema/schema';
import {
  TextEditor,
  initialTextEditorValue,
  parseEditorContent,
  prepareContentForSave,
} from '@/shared/components/editor';
import { Button, Form } from '@/shared/components/ui';
import { cn, extractText } from '@/shared/lib';
import { classifyInquiryError, handleApiError } from '@/shared/lib/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { JSONContent } from '@tiptap/react';

// 이미지 업로드 중 버튼 비활성화
const hasUploadingNode = (node: JSONContent): boolean => {
  if (node.attrs?.isUploading === true) return true;
  return (node.content ?? []).some(hasUploadingNode);
};

export default function InquiryAnswerWrite({
  inquiry,
  isEditMode = false,
  onCancel,
}: {
  inquiry: InquiryDetail;
  isEditMode?: boolean;
  onCancel?: () => void;
}) {
  const queryClient = useQueryClient();

  const { data: teacherProfile } = useTeacherProfile(inquiry.targetTeacherId);

  const createInquiryAnswerMutation = useCreateInquiryAnswer(inquiry.id);
  const updateInquiryAnswerMutation = useUpdateInquiryAnswer(
    inquiry.id,
    onCancel
  );
  const mutation = isEditMode
    ? updateInquiryAnswerMutation
    : createInquiryAnswerMutation;

  // 수정 모드일 경우, 초기값 세팅
  const initialContent =
    isEditMode && inquiry.answer
      ? parseEditorContent(inquiry.answer.resolvedContent.content)
      : initialTextEditorValue;

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<InquiryAnswerForm>({
    resolver: zodResolver(InquiryAnswerFormSchema),
    defaultValues: { content: initialContent },
    mode: 'onChange',
  });

  // 이미지 업로드 중 버튼 비활성화
  const content = watch('content');
  const isUploading = useMemo(() => hasUploadingNode(content), [content]);

  const onSubmit = (data: InquiryAnswerForm) => {
    const { contentString, mediaIds } = prepareContentForSave(data.content);
    mutation.mutate(
      { content: contentString, mediaIds },
      {
        onError: (error) => {
          handleApiError(error, classifyInquiryError, {
            // INQUIRY_ANSWER_ALREADY_EXISTS, INQUIRY_NOT_FOUND, INQUIRY_ANSWER_NOT_FOUND, INQUIRY_ANSWER_FORBIDDEN
            onContext: () =>
              queryClient.invalidateQueries({
                queryKey: inquiryKeys.detail(inquiry.id),
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
              disabled={
                mutation.isPending || !isDirty || !isValid || isUploading
              }
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
