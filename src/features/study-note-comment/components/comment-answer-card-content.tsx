'use client';

import Image from 'next/image';

import {
  CheckRead,
  ReadPeopleList,
  useReadPeoplePopover,
} from '@/shared/components/check-read';
import {
  TextEditor,
  TextViewer,
  hasMeaningfulEditorContent,
  parseEditorContent,
  prepareContentForSave,
} from '@/shared/components/editor';
import { Button } from '@/shared/components/ui';
import { getRelativeTimeString } from '@/shared/lib';
import { JSONContent } from '@tiptap/react';

import { useReadCommentList, useUpdateComment } from '../hooks/use-comment';

interface CommentAnswerCardContentProps {
  authorName: string;
  roleLabel?: string;
  profileImageSrc: string;
  content: string;
  modDate?: string | null;
  isEditing: boolean;
  isDeleted?: boolean;
  editContent: JSONContent | null | undefined;
  teachingNoteId: number;
  commentId: number;
  readCount: number;
  onEditContentChange: (value: JSONContent) => void;
  onCancel: () => void;
}

export const CommentAnswerCardContent = ({
  authorName,
  roleLabel,
  profileImageSrc,
  content,
  modDate,
  isEditing,
  isDeleted = false,
  editContent,
  teachingNoteId,
  commentId,
  readCount,
  onEditContentChange,
  onCancel,
}: CommentAnswerCardContentProps) => {
  const initialEditContent = parseEditorContent(content);
  const currentEditContent = editContent ?? initialEditContent;

  const { isOpen, side, triggerRef, popupRef, open, close } =
    useReadPeoplePopover();

  // 팝 오버를 열기전 호출 x
  const {
    data,
    isPending: readListPending,
    isError: isCommentError,
  } = useReadCommentList(teachingNoteId, commentId, isOpen);

  const displayReadCount = data?.length ?? readCount;

  const { mutate, isPending: updating } = useUpdateComment();

  const isSubmitDisabled =
    !hasMeaningfulEditorContent(currentEditContent) || updating;

  const onClick = () => {
    if (!editContent) return;

    const { contentString, mediaIds } = prepareContentForSave(editContent);

    mutate(
      {
        teachingNoteId,
        commentId,
        data: {
          content: contentString,
          mediaIds,
        },
      },
      {
        onSuccess: () => {
          onCancel();
        },
      }
      // TODO: 에러처리
    );
  };

  if (isEditing) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="border-gray-12 h-9 w-9 shrink-0 overflow-hidden rounded-full border">
              <Image
                src={profileImageSrc}
                alt="profile"
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1">
              <p className="font-body2-normal text-gray-12">{authorName}</p>
              {roleLabel === '학생' && (
                <>
                  <p className="text-gray-7">·</p>
                  <p className="font-body2-normal text-gray-7">{roleLabel}</p>
                </>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outlined"
              onClick={onCancel}
              className="font-label-normal disabled:font-label-normal h-[35px] shrink-0 px-6 py-2"
            >
              취소
            </Button>
            <Button
              disabled={isSubmitDisabled}
              className="font-label-normal disabled:font-label-normal h-[35px] shrink-0 px-6 py-2"
              onClick={onClick}
            >
              {updating ? '수정 중...' : '수정 완료'}
            </Button>
          </div>
        </div>

        <TextEditor
          value={editContent ?? initialEditContent}
          onChange={onEditContentChange}
          placeholder="내용을 수정해주세요.."
          targetType="TEACHING_NOTE"
          minHeight="120px"
          maxHeight="240px"
        />
      </div>
    );
  }

  return (
    <>
      <div className="mt-3">
        {isDeleted ? (
          <p className="text-gray-5 font-body2-normal">삭제된 댓글입니다.</p>
        ) : (
          <TextViewer
            value={parseEditorContent(content)}
            className="font-body2-normal text-gray-12 leading-6"
          />
        )}
      </div>

      <div className="mt-2 flex items-center justify-end gap-2">
        <p className="font-label-normal text-gray-5">
          {modDate ? `${getRelativeTimeString(modDate)} 작성` : ''}
        </p>
        {displayReadCount > 0 && (
          <div
            ref={triggerRef}
            className="relative"
            onMouseEnter={open}
            onMouseLeave={close}
          >
            <div className="bg-gray-2 font-label-normal text-gray-9 rounded-sm px-1 py-1.5">
              읽음 {`${displayReadCount}`}
            </div>
            {isOpen && (
              <CheckRead
                side={side}
                popupRef={popupRef}
                open={open}
                close={close}
              >
                <ReadPeopleList
                  data={data}
                  displayReadCount={displayReadCount}
                  isLoading={readListPending}
                  isError={isCommentError}
                />
              </CheckRead>
            )}
          </div>
        )}
      </div>
    </>
  );
};
