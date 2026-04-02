'use client';

import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useGetTeacherNotesList } from '@/features/study-notes/hooks';
import { StudyNoteGroupPageable } from '@/features/study-notes/model';
import { ColumnLayout } from '@/layout/column-layout';
import { TextEditor, prepareContentForSave } from '@/shared/components/editor';
import { RequiredMark, Select } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { classifyQnaError, handleApiError } from '@/shared/lib/errors';
import { JSONContent } from '@tiptap/react';

import { QnACreateForm } from '../../schema/create';
import { useWriteQnAMutation } from '../../services/query';
import { QnAVisibility } from '../../types';
import { TagInputQna } from './tag-input-qna';

type Props = {
  studyRoomId: number;
};

const WriteArea = ({ studyRoomId }: Props) => {
  const router = useRouter();
  const { watch } = useFormContext<QnACreateForm>();

  const visibility = watch('visibility');
  const roomId = watch('studyRoomId');

  const NOTE_PAGEABLE: StudyNoteGroupPageable = {
    page: 0,
    size: 20,
    sortKey: 'LATEST_EDITED',
  };

  const { data: notes } = useGetTeacherNotesList({
    studyRoomId: roomId,
    pageable: NOTE_PAGEABLE,
    enabled: !!roomId,
  });

  const { mutate, isPending } = useWriteQnAMutation();
  const {
    handleSubmit,
    register,
    setValue,
    setError,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useFormContext<QnACreateForm>();

  useEffect(() => {
    if (studyRoomId != null) {
      setValue('studyRoomId', studyRoomId, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [studyRoomId, setValue]);

  const isButtonDisabled = !isValid || isPending || isSubmitting;

  const onSubmit = (data: {
    studyRoomId: number;
    title: string;
    content: JSONContent;
    visibility: QnAVisibility;
    relatedTeachingNoteId: number | null;
  }) => {
    const { contentString, mediaIds } = prepareContentForSave(data.content);

    mutate(
      {
        studyRoomId,
        title: data.title,
        content: contentString,
        visibility: data.visibility,
        mediaIds: mediaIds,
        relatedTeachingNoteId: data.relatedTeachingNoteId!,
      },
      {
        onSuccess: () => {
          router.replace(`/study-rooms/${studyRoomId}/qna`);
        },
        onError: (error) => {
          handleApiError(error, classifyQnaError, {
            onField: (msg) => {
              setError('content', {
                type: 'server',
                message: msg,
              });
            },

            // 사용자가 toast 에러를 읽을 시간을 위한 setTimeout
            onContext: () => {
              setTimeout(() => {
                router.replace(`/study-rooms/${studyRoomId}/qna`);
              }, 1500);
            },
            onAuth: () => {
              setTimeout(() => {
                // TODO: 로그아웃이 안되어 있다면..? -> 강제 로그아웃
                router.replace(`/login`);
              }, 1500);
            },
            onUnknown: () => {},
          });
        },
      }
    );
  };

  useEffect(() => {
    const qnaTitle = sessionStorage.getItem('qna-title');

    if (qnaTitle) {
      setValue('title', qnaTitle, {
        shouldDirty: false,
        shouldValidate: true,
      });
      sessionStorage.removeItem('qna-title');
    }
  }, [setValue]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <ColumnLayout.Right className="desktop:min-w-[740px] border-line-line1 h-fit w-full rounded-xl border bg-white px-8 py-10">
        <div className="flex w-full justify-between">
          <span>
            <div className="text-key-color-primary font-semibold">
              질문 작성
            </div>
            <h1 className="mt-2 text-[32px] font-bold">
              어떤 궁금증이 <br /> 생겼나요?
            </h1>
          </span>
          <Image
            src="/studyroom/study-room-write-header.png"
            alt="header-image"
            width={71}
            height={151}
          />
        </div>
        <div className="space-y-8">
          <Form.Item error={!!errors.title}>
            <Form.Label>
              제목
              <RequiredMark />
            </Form.Label>
            <Form.Control>
              <Input
                {...register('title')}
                type="text"
                placeholder="질문의 제목을 입력해주세요."
                disabled={isPending}
              />
            </Form.Control>
            <Form.ErrorMessage className="text-system-warning text-sm">
              {errors.title?.message}
            </Form.ErrorMessage>
          </Form.Item>

          {/* 수업노트 연결 1:1 */}
          <Form.Item error={!!errors.relatedTeachingNoteId}>
            <Form.Label>수업노트 연결</Form.Label>

            <Form.Control>
              <Controller
                name="relatedTeachingNoteId"
                control={control}
                render={({ field }) => (
                  <TagInputQna
                    studyNotes={notes?.content ?? []}
                    selectedId={field.value}
                    onChange={field.onChange}
                    placeholder="질문과 연관된 수업노트를 연결해주세요."
                    error={!!errors.relatedTeachingNoteId}
                    disabled={isPending}
                  />
                )}
              />
            </Form.Control>

            {errors.relatedTeachingNoteId && (
              <Form.ErrorMessage className="text-system-warning text-sm">
                {errors.relatedTeachingNoteId.message}
              </Form.ErrorMessage>
            )}
          </Form.Item>

          {/* 내용 */}
          <Form.Item error={!!errors.content}>
            <Form.Label>
              내용
              <RequiredMark />
            </Form.Label>
            <Form.Control>
              <Controller
                name="content"
                control={control}
                render={({ field }) => {
                  return (
                    <TextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="질문 내용을 입력해주세요..."
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
          <hr
            style={{
              borderImage:
                'repeating-linear-gradient(to right, gray 0, gray 4px, transparent 4px, transparent 8px)',
              borderImageSlice: 1,
            }}
          />
          <Form.Item className="mt-8">
            <Form.Label className="text-2xl font-semibold">
              공개 범위
              <RequiredMark />
            </Form.Label>
            <Controller
              name="visibility"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <Select.Trigger
                    className="w-[240px]"
                    placeholder="공개 범위 선택"
                  />
                  <Select.Content>
                    <Select.Option value="STUDENT_AND_PARENT">
                      보호자 공개
                    </Select.Option>
                    <Select.Option value="STUDENT_ONLY">
                      보호자 비공개
                    </Select.Option>
                  </Select.Content>
                </Select>
              )}
            />

            {visibility === 'STUDENT_AND_PARENT' && (
              <Form.Description className="text-text-sub2 flex gap-x-[3px] text-sm">
                <Image
                  src="/common/info.svg"
                  alt="info-icon"
                  width={16}
                  height={16}
                />
                보호자 공개 선택 시, 나와 연결된 보호자도 이 질문을 볼 수
                있습니다.
              </Form.Description>
            )}
          </Form.Item>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isButtonDisabled}
              className="w-[200px] rounded-sm"
            >
              {isSubmitting ? '등록 중...' : '작성하기'}
            </Button>
          </div>
        </div>
      </ColumnLayout.Right>
    </Form>
  );
};
export default WriteArea;
