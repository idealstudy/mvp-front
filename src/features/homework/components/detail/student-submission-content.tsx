import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { DialogAction, DialogState } from '@/shared/components/dialog';
import {
  TextEditor,
  TextViewer,
  mergeResolvedContentWithMediaIds,
  prepareContentForSave,
} from '@/shared/components/editor';
import { Button } from '@/shared/components/ui';
import { DropdownMenu } from '@/shared/components/ui/dropdown-menu';
import { classifyHomeworkError, handleApiError } from '@/shared/lib/errors';
import { getRelativeTimeString } from '@/shared/lib/utils';
import { JSONContent } from '@tiptap/react';

import {
  useRemoveStudentHomework,
  useUpdateStudentHomework,
} from '../../hooks/student/useStudentHomeworkMutations';
import { parseEditorContent } from '../../lib/parse-editor-content';
import { HOMEWORK_SUBMIT_STATUS_LABEL } from '../../model/constants';
import { HomeworkSubmitStatus } from '../../model/homework.types';
import { HomeworkDialog } from '../dialog';

type Props = {
  homeworkStudentId: number;
  content: string;
  rawContent?: string;
  authorName: string;
  regDate: string;
  submitStatus?: HomeworkSubmitStatus;

  studyRoomId: number;
  homeworkId: number;
  dialog: DialogState;
  dispatch: (action: DialogAction) => void;
};
// 학생이 과제 제출시 내용 담는 ui
export const StudentSubmissionContent = ({
  homeworkStudentId,
  studyRoomId,
  homeworkId,
  content,
  rawContent,
  authorName,
  regDate,
  submitStatus,
  dialog,
  dispatch,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<JSONContent | null>(null);
  const [localContent, setLocalContent] = useState(content);

  const router = useRouter();

  // content prop이 변경되면 localContent 동기화 (쿼리 refetch 후)
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

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

  const { isPending: isDeleting } = useRemoveStudentHomework();
  const { mutate: updateHomework, isPending: isUpdating } =
    useUpdateStudentHomework();

  const handleUpdate = () => {
    setIsEditing(true);
    setEditContent(parsedEditorContent);
  };

  const handleSave = () => {
    if (!editContent) return;
    const { contentString } = prepareContentForSave(editContent);

    updateHomework(
      {
        studyRoomId,
        homeworkStudentId,
        homeworkId,
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
            // TODO : setError 추가..?
            onField: () => {},

            onContext: () => {
              setTimeout(() => {
                router.replace(`/study-rooms/${studyRoomId}/homework`);
              }, 1500);
            },

            onAuth: () => {
              setTimeout(() => {
                router.replace('/login');
              }, 1500);
            },

            onUnknown: () => {},
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
    dispatch({
      type: 'OPEN',
      scope: 'homework-student',
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
      <div className="border-line-line1 flex flex-col gap-5 rounded-xl border bg-white p-10">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-100" />
            <span className="font-body2-heading">{authorName}</span>

            {submitStatus && (
              <span className="rounded-full border px-3 py-1 text-xs">
                {HOMEWORK_SUBMIT_STATUS_LABEL[submitStatus]}
              </span>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenu.Trigger className="flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-100">
              <Image
                src="/studynotes/gray-kebab.svg"
                width={24}
                height={24}
                alt="study-notes"
                className="cursor-pointer"
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <>
                <DropdownMenu.Item onClick={handleUpdate}>
                  {isUpdating ? '수정중...' : '수정하기'}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  variant="danger"
                  onClick={() => handleDelete()}
                >
                  {isDeleting ? '삭제중...' : '삭제하기'}
                </DropdownMenu.Item>
              </>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
        {isEditing ? (
          <div className="space-y-3">
            <TextEditor
              value={editContent || parsedEditorContent}
              onChange={(value) => setEditContent(value)}
              placeholder="내용을 수정하세요..."
              targetType="HOMEWORK"
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
