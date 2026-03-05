'use client';

import { useMemo, useReducer, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  StudyroomConfirmDialog,
  dialogReducer,
  initialDialogState,
} from '@/shared/components/dialog';
import {
  TextEditor,
  TextViewer,
  mergeResolvedContentWithMediaIds,
  parseEditorContent,
  prepareContentForSave,
} from '@/shared/components/editor';
import { Button } from '@/shared/components/ui/button';
import { DropdownMenu } from '@/shared/components/ui/dropdown-menu';
import { useRole } from '@/shared/hooks/use-role';
import { classifyQnaError, handleApiError } from '@/shared/lib/errors';
import { getRelativeTimeString } from '@/shared/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { JSONContent } from '@tiptap/react';

import {
  useDeleteQnAContextMutation,
  useDeleteQnAMessageMutation,
  useUpdateQnAMessageMutation,
} from '../../services/query';
import { QnADetailResponse } from '../../types';

type Props = {
  id: number;
  content: string;
  rawContent?: string;
  authorName: string;
  regDate: string;
  studyRoomId: number;
  contextId: number;
  qnaDetail: QnADetailResponse;
};

const QuestionContent = ({
  id,
  content,
  rawContent,
  authorName,
  regDate,
  studyRoomId,
  contextId,
  qnaDetail,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<JSONContent | null>(null);

  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);
  const [isLastDeleteMode, setIsLastDeleteMode] = useState(false);
  const queryClient = useQueryClient();

  const router = useRouter();

  const { role } = useRole();

  const { mutate: deleteQnA } = useDeleteQnAContextMutation();

  const { mutate: updateMessage, isPending: isUpdating } =
    useUpdateQnAMessageMutation(role);
  const { mutate: deleteMessage, isPending: isDeleting } =
    useDeleteQnAMessageMutation(role);

  // 에디터 상태 초기화
  const resetEditor = () => {
    setIsEditing(false);
    setEditContent(null);
  };

  const parsedDisplayContent = useMemo(
    () => parseEditorContent(content),
    [content]
  );
  const parsedRawContent = useMemo(
    () => parseEditorContent(rawContent ?? content),
    [rawContent, content]
  );
  const parsedEditorContent = useMemo(
    () =>
      rawContent
        ? mergeResolvedContentWithMediaIds(
            parsedRawContent,
            parsedDisplayContent
          )
        : parsedDisplayContent,
    [rawContent, parsedRawContent, parsedDisplayContent]
  );

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(parsedEditorContent);
    setIsOpen(false);
  };

  const handleSave = () => {
    if (!editContent) return;
    const { contentString } = prepareContentForSave(editContent);

    updateMessage(
      {
        studyRoomId,
        contextId,
        messageId: id,
        content: contentString,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setEditContent(null);
        },
        onError: (error) => {
          handleApiError(error, classifyQnaError, {
            onField: () => {},
            onContext: resetEditor,
            onAuth: resetEditor,
            onUnknown: resetEditor,
          });
        },
      }
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(null);
  };

  const handleDelete = () => {
    const studentQuestionCount = qnaDetail.messages.filter(
      (m) => m.authorType === 'ROLE_STUDENT'
    ).length;

    const isLast = studentQuestionCount === 1;

    // 상태 업데이트 및 다이얼로그 오픈
    setIsLastDeleteMode(isLast);
    dispatch({
      type: 'OPEN',
      scope: 'qna',
      kind: 'delete',
    });

    setIsOpen(false);
  };

  const executeDelete = () => {
    if (isLastDeleteMode) {
      // 1. 마지막 질문 -> 방 전체 삭제
      deleteQnA(
        { studyRoomId, contextId },
        {
          onSuccess: () => {
            dispatch({ type: 'GO_TO_CONFIRM' });
            router.replace(`/study-rooms/${studyRoomId}/qna`);
          },
          onError: (error) => {
            handleApiError(error, classifyQnaError, {
              onContext: () => dispatch({ type: 'CLOSE' }),
              onAuth: () => dispatch({ type: 'CLOSE' }),
              onField: () => dispatch({ type: 'CLOSE' }),
              onUnknown: () => dispatch({ type: 'CLOSE' }),
            });
          },
        }
      );
    } else {
      // 2. 일반 질문 -> 메시지 삭제
      deleteMessage(
        { studyRoomId, contextId, messageId: id },
        {
          onSuccess: () => {
            dispatch({ type: 'GO_TO_CONFIRM' });
          },
          onError: (error) => {
            handleApiError(error, classifyQnaError, {
              onContext: () => dispatch({ type: 'CLOSE' }),
              onAuth: () => dispatch({ type: 'CLOSE' }),
              onField: () => dispatch({ type: 'CLOSE' }),
              onUnknown: () => dispatch({ type: 'CLOSE' }),
            });
          },
        }
      );
    }
  };

  const handleConfirmComplete = () => {
    dispatch({ type: 'CLOSE' });

    queryClient.refetchQueries({
      queryKey: ['qnaDetail', role, { studyRoomId, contextId }],
      type: 'active',
    });
  };

  return (
    <>
      {dialog.status === 'open' && dialog.scope === 'qna' && (
        <>
          {dialog.kind === 'delete' && (
            <StudyroomConfirmDialog
              type="delete"
              open={true}
              dispatch={dispatch}
              onDelete={executeDelete}
              title={'질문을 삭제하시겠습니까?'}
              description={
                isLastDeleteMode
                  ? '마지막 질문을 삭제하면 질문 방도 함께 삭제되며 복구할 수 없습니다.'
                  : '삭제된 내용은 복구할 수 없습니다.'
              }
            />
          )}

          {dialog.kind === 'onConfirm' && (
            <StudyroomConfirmDialog
              type="confirm"
              open={true}
              dispatch={dispatch}
              description="질문이 삭제되었습니다."
              onConfirm={handleConfirmComplete}
            />
          )}
        </>
      )}
      <div className="border-line-line1 flex flex-col gap-5 rounded-xl border bg-white p-10">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center gap-3">
            <div className="bg-gray-scale-gray-10 h-10 w-10 rounded-full" />
            <span className="font-body2-heading">{authorName}</span>
          </div>
          {role === 'ROLE_STUDENT' && (
            <DropdownMenu
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <DropdownMenu.Trigger className="flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-100">
                <Image
                  src="/studynotes/gray-kebab.svg"
                  width={24}
                  height={24}
                  alt="study-notes"
                  className="cursor-pointer"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="flex min-w-[110px] flex-col items-stretch">
                <DropdownMenu.Item
                  className="justify-center"
                  onClick={handleEdit}
                  disabled={isUpdating || isDeleting}
                >
                  {isUpdating ? '수정 중...' : '수정'}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="justify-center"
                  variant="danger"
                  onClick={handleDelete}
                  disabled={isUpdating || isDeleting}
                >
                  {isDeleting ? '삭제 중...' : '삭제'}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          )}
        </div>
        {isEditing ? (
          <div className="space-y-3">
            <TextEditor
              value={editContent || parsedEditorContent}
              onChange={(value) => setEditContent(value)}
              placeholder="내용을 수정하세요..."
              targetType="QNA"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isUpdating}
              >
                취소
              </Button>
              <Button
                onClick={handleSave}
                disabled={isUpdating || !editContent}
              >
                {isUpdating ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="font-body2-normal">
              <TextViewer value={parsedDisplayContent} />
            </div>
            <span className="font-caption-normal text-gray-scale-gray-60 self-end">
              {getRelativeTimeString(regDate) + ' 작성'}
            </span>
          </>
        )}
      </div>
    </>
  );
};

export default QuestionContent;
