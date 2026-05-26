'use client';

import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import {
  TextEditor,
  initialTextEditorValue,
  parseEditorContent,
  prepareContentForSave,
} from '@/shared/components/editor';
import { Button, Dialog, Form, Input } from '@/shared/components/ui';
import { extractText } from '@/shared/lib';
import { cn } from '@/shared/lib';
import { handleApiError } from '@/shared/lib/errors/error-handler';
import { classifyReviewError } from '@/shared/lib/errors/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { JSONContent } from '@tiptap/react';

import { useCreateReview } from '../hooks/use-create-review';
import { useUpdateReview } from '../hooks/use-update-review';
import { ReviewForm, ReviewFormSchema } from '../schema/review.schema';

type CreateMode = {
  mode: 'create';
  studyRoomId: number;
  dstMemberId: number;
};

type EditMode = {
  mode: 'edit';
  reviewId: number;
  initialData: {
    content: string;
    startDate: string;
    endDate: string | null;
  };
};

type ReviewFormModalProps = (CreateMode | EditMode) & {
  isOpen: boolean;
  onClose: () => void;
};

const today = new Date().toISOString().split('T')[0];

const hasUploadingNode = (node: JSONContent): boolean => {
  if (node.attrs?.isUploading === true) return true;
  return (node.content ?? []).some(hasUploadingNode);
};

export const ReviewFormModal = (props: ReviewFormModalProps) => {
  const { isOpen, onClose } = props;
  const router = useRouter();

  const isEditMode = props.mode === 'edit';

  const { mutate: createMutate, isPending: isCreatePending } =
    useCreateReview();
  const { mutate: updateMutate, isPending: isUpdatePending } = useUpdateReview(
    isEditMode ? props.reviewId : 0
  );
  const isPending = isCreatePending || isUpdatePending;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<ReviewForm>({
    resolver: zodResolver(ReviewFormSchema),
    mode: 'onChange',
    defaultValues: {
      content: isEditMode
        ? parseEditorContent(props.initialData.content)
        : initialTextEditorValue,
      startDate: isEditMode ? props.initialData.startDate : '',
      endDate: isEditMode ? (props.initialData.endDate ?? today) : today,
    },
  });

  const content = watch('content');
  const isUploading = useMemo(() => hasUploadingNode(content), [content]);

  const onSubmit = (data: ReviewForm) => {
    const { contentString, mediaIds } = prepareContentForSave(data.content);

    const handleError = (error: unknown) => {
      handleApiError(error, classifyReviewError, {
        onField: (msg) => setError('root', { message: msg }),
        onContext: () => onClose(),
        onAuth: () => router.replace('/login'),
        onUnknown: () => {},
      });
    };

    if (props.mode === 'create') {
      createMutate(
        {
          studyRoomId: props.studyRoomId,
          dstMemberId: props.dstMemberId,
          content: contentString,
          mediaIds,
          startDate: data.startDate,
          endDate: data.endDate || undefined,
        },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
          onError: handleError,
        }
      );
    } else {
      updateMutate(
        {
          content: contentString,
          mediaIds: mediaIds ?? [],
          startDate: data.startDate,
          endDate: data.endDate || undefined,
        },
        {
          onSuccess: () => onClose(),
          onError: handleError,
        }
      );
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Content
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        <Dialog.Header>
          <Dialog.Title>{isEditMode ? '후기 수정' : '후기 작성'}</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body>
          <Form
            id="review-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-3">
              <Form.Item
                error={!!errors.startDate}
                className="flex-1"
              >
                <Form.Label required>수업 시작일</Form.Label>
                <Form.Control>
                  <Input
                    type="date"
                    {...register('startDate')}
                    max={today}
                  />
                </Form.Control>
                <Form.ErrorMessage>
                  {errors.startDate?.message}
                </Form.ErrorMessage>
              </Form.Item>

              <Form.Item className="flex-1">
                <Form.Label>수업 종료일</Form.Label>
                <Form.Control>
                  <Input
                    type="date"
                    {...register('endDate')}
                    max={today}
                  />
                </Form.Control>
              </Form.Item>
            </div>

            <Form.Item error={!!errors.content}>
              <Form.Label required>후기 내용</Form.Label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => {
                  const length = extractText(
                    JSON.stringify(field.value)
                  ).length;
                  return (
                    <>
                      <TextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="수업 후기를 입력해주세요."
                        minHeight="200px"
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-system-warning text-sm">
                          {typeof errors.content?.message === 'string' &&
                            errors.content.message}
                        </p>
                        <span
                          className={cn(
                            length > 1000
                              ? 'text-system-warning'
                              : 'text-gray-5'
                          )}
                        >
                          {length} / 1000
                        </span>
                      </div>
                    </>
                  );
                }}
              />
            </Form.Item>

            {errors.root?.message && (
              <p className="text-system-warning text-sm">
                {errors.root.message}
              </p>
            )}
          </Form>
        </Dialog.Body>

        <Dialog.Footer>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isPending}
          >
            취소
          </Button>
          <Button
            type="submit"
            form="review-form"
            disabled={
              isPending ||
              !isValid ||
              isUploading ||
              (isEditMode ? !isDirty : false)
            }
          >
            {isPending ? '저장 중...' : isEditMode ? '수정' : '등록'}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
