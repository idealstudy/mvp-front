'use client';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import {
  useRemoveTeacherHomeworkFeedback,
  useUpdateTeacherHomeworkFeedback,
} from '@/features/homework/hooks/teacher/useTeacherHomeworkFeedbackMutations';
import { parseEditorContent } from '@/features/homework/lib/parse-editor-content';
import { DialogAction, DialogState } from '@/shared/components/dialog';
import {
  TextEditor,
  TextViewer,
  mergeResolvedContentWithMediaIds,
  prepareContentForSave,
} from '@/shared/components/editor';
import { Button } from '@/shared/components/ui/button';
import { DropdownMenu } from '@/shared/components/ui/dropdown-menu';
import { useRole } from '@/shared/hooks/use-role';
import { classifyHomeworkError, handleApiError } from '@/shared/lib/errors';
import { getRelativeTimeString } from '@/shared/lib/utils';
import { JSONContent } from '@tiptap/react';

import { HomeworkDialog } from '../../dialog';

type Props = {
  content: string;
  rawContent?: string;
  regDate: string;
  studyRoomId: number;
  homeworkStudentId: number;
  homeworkId: number;
  dialog: DialogState;
  dispatch: (action: DialogAction) => void;
};

export const FeedbackAnswer = ({
  content,
  rawContent,
  regDate,
  studyRoomId,
  homeworkStudentId,
  homeworkId,
  dialog,
  dispatch,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<JSONContent | null>(null);
  const [localContent, setLocalContent] = useState(content);

  // content prop이 변경되면 localContent 동기화 (쿼리 refetch 후)
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const { role } = useRole();

  const { mutate: updateMessage, isPending: isUpdating } =
    useUpdateTeacherHomeworkFeedback();
  const { isPending: isDeleting } = useRemoveTeacherHomeworkFeedback();

  // JSONContent 파싱
  const parsedDisplayContent = useMemo(
    () => parseEditorContent(localContent),
    [localContent]
  );
  const parsedRawContent = useMemo(
    () => parseEditorContent(rawContent ?? localContent),
    [rawContent, localContent]
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

  // 에디터 초기화
  const resetEditor = () => {
    setIsEditing(false);
    setEditContent(null);
  };

  const handleSave = () => {
    if (!editContent) return;

    const { contentString } = prepareContentForSave(editContent);

    updateMessage(
      {
        studyRoomId,
        homeworkId,
        homeworkStudentId,
        content: contentString,
      },
      {
        onSuccess: () => {
          setLocalContent(contentString);
          setIsEditing(false);
          setEditContent(null);
        },
        onError: (error) => {
          handleApiError(error, classifyHomeworkError, {
            onContext: resetEditor,
            onAuth: resetEditor,
            onUnknown: () => {}, // 필요 시 에디터 포커스 로직 정도만 추가
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
    setIsOpen(false);
    dispatch({
      type: 'OPEN',
      scope: 'homework-feedback',
      kind: 'delete',
      payload: {
        homeworkId,
        homeworkStudentId,
        content,
      },
    });
  };

  return (
    <>
      <HomeworkDialog
        state={dialog}
        dispatch={dispatch}
        content={content}
        studyRoomId={studyRoomId}
        homeworkStudentId={homeworkStudentId}
        homeworkId={homeworkId}
      />
      <div className="border-line-line1 flex flex-col gap-5 rounded-xl border bg-white px-8 py-8">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center gap-3">
            <Image
              src="/qna/reply.svg"
              width={56}
              height={24}
              alt="replay icon"
            />
            <span className="font-body2-heading">선생님 피드백</span>
          </div>
          {role === 'ROLE_TEACHER' && (
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
              targetType="HOMEWORK"
            />
            <div className="space-y-2">
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
