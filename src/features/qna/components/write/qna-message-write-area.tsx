'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { ColumnLayout } from '@/layout/column-layout';
import { TextEditor } from '@/shared/components/editor';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { useRole } from '@/shared/hooks/use-role';
import { classifyQnaError, handleApiError } from '@/shared/lib/errors';
import { trackReplyCreateClick } from '@/shared/lib/gtm/trackers';
import { useMemberStore } from '@/store';
import { JSONContent } from '@tiptap/react';

import { QnAMessageForm } from '../../schema/create';
import { useWriteQnAMessageMutation } from '../../services/query';

type Props = {
  studyRoomId: number;
  contextId: number;
};

const WriteArea = ({ studyRoomId, contextId }: Props) => {
  const { role } = useRole();
  const session = useMemberStore((s) => s.member);

  const router = useRouter();

  const { mutate, isPending } = useWriteQnAMessageMutation(role);
  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useFormContext<QnAMessageForm>();

  const isButtonDisabled = !isValid || isPending || isSubmitting;

  const onSubmit = (data: { content: JSONContent }) => {
    // 답글 작성 클릭 이벤트
    trackReplyCreateClick(
      {
        room_id: studyRoomId,
        question_id: contextId,
        user_id: session?.id ?? 0,
      },
      session?.role ?? null
    );

    mutate(
      {
        studyRoomId,
        contextId,
        content: JSON.stringify(data.content),
      },
      {
        onSuccess: () => {
          // 폼 리셋
          reset({ content: {} });
          // 쿼리 무효화는 mutation hook에서 처리되므로 라우팅 불필요
          // 같은 페이지에 있으므로 자동으로 업데이트됨
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
                      placeholder={
                        role === 'ROLE_TEACHER'
                          ? '질문에 대한 답변을 적어주세요...'
                          : '추가로 궁금한 점을 적어주세요...'
                      }
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
              {isSubmitting ? '등록 중...' : '작성하기'}
            </Button>
          </div>
        </div>
      </ColumnLayout.Right>
    </Form>
  );
};
export default WriteArea;
