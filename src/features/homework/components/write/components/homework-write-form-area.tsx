'use client';

import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { usePostStudentHomework } from '@/features/homework/hooks/student/useStudentHomeworkMutations';
import { ColumnLayout } from '@/layout/column-layout';
import { TextEditor, prepareContentForSave } from '@/shared/components/editor';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { classifyHomeworkError, handleApiError } from '@/shared/lib/errors';

import { StudentHomeworkForm } from '../schemas/create';

type Props = {
  studyRoomId: number;
  homeworkId: number;
};

// 학생이 과제 제출
export const WriteFormArea = ({ studyRoomId, homeworkId }: Props) => {
  const { mutate, isPending } = usePostStudentHomework();
  const {
    handleSubmit,
    setValue,
    setError,
    control,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useFormContext<StudentHomeworkForm>();

  const router = useRouter();

  useEffect(() => {
    if (studyRoomId != null) {
      setValue('studyRoomId', studyRoomId, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }

    if (homeworkId != null) {
      setValue('homeworkId', homeworkId, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [studyRoomId, homeworkId, setValue]);

  const isButtonDisabled = !isValid || isPending || isSubmitting;

  const onSubmit = (data: StudentHomeworkForm) => {
    const { contentString, mediaIds } = prepareContentForSave(data.content);

    mutate(
      {
        studyRoomId,
        homeworkId,
        content: contentString,
        mediaIds,
      },
      {
        onSuccess: () => {
          reset({ content: {} });
        },
        onError: (error) => {
          handleApiError(error, classifyHomeworkError, {
            onField: (msg) => {
              setError('root', { message: msg });
            },

            onAuth: () => {
              setTimeout(() => {
                router.replace('/login');
              }, 1500);
            },

            onContext: () => {
              setTimeout(() => {
                router.replace(`/study-rooms/${studyRoomId}/homework`);
              }, 1500);
            },

            onUnknown: () => {},
          });
        },
      }
    );
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <ColumnLayout.Right className="desktop:min-w-[740px] h-fit w-full">
        <div className="space-y-5">
          {/* 내용 */}
          <Form.Item error={!!errors.content}>
            <Form.Control>
              <Controller
                name="content"
                control={control}
                render={({ field }) => {
                  return (
                    <TextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="제출할 과제를 작성해 주세요..."
                      targetType="HOMEWORK"
                    />
                  );
                }}
              />
            </Form.Control>
            {errors.content && (
              <Form.ErrorMessage className="text-system-warning text-sm">
                {typeof errors.content?.message === 'string'
                  ? errors.content.message
                  : null}
              </Form.ErrorMessage>
            )}
          </Form.Item>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isButtonDisabled}
              className="w-[200px] rounded-sm"
            >
              작성하기
            </Button>
          </div>
        </div>
      </ColumnLayout.Right>
    </Form>
  );
};
