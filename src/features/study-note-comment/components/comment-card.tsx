'use client';

import { useState } from 'react';

import Image from 'next/image';

import { ConfirmDialog, type DialogAction } from '@/shared/components/dialog';
import { parseEditorContent } from '@/shared/components/editor';
import { useMemberStore } from '@/store';
import { JSONContent } from '@tiptap/react';

import { useDeleteComment } from '../hooks/use-comment';
import { CommentAnswerCardContent } from './comment-answer-card-content';
import { CommentAnswerCardHeader } from './comment-answer-card-header';
import { CommentReplyComposer } from './comment-reply-composer';

interface CommentAnswerCardProps {
  authorId: number;
  authorName: string;
  roleLabel?: string;
  content: string;
  profileImageSrc: string;
  isStudent?: boolean;
  showReplyArrow?: boolean;
  showReaction?: boolean;
  className?: string;
  teachingNoteId: number;
  commentId: number;
  expiredAt: string;
  readCount: number;
  isDeleted?: boolean;
}

export const CommentCard = ({
  authorId,
  authorName,
  roleLabel,
  content,
  profileImageSrc,
  isStudent = false,
  showReplyArrow = false,
  showReaction = true,
  className,
  teachingNoteId,
  commentId,
  expiredAt,
  readCount,
  isDeleted,
}: CommentAnswerCardProps) => {
  const [selectedEmojis, setSelectedEmojis] = useState<Record<string, number>>(
    {}
  );
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<JSONContent | null>();
  const [isReplying, setIsReplying] = useState(false);
  const initialEditContent = parseEditorContent(content);
  const [replyContent, setReplyContent] = useState<JSONContent>(() =>
    parseEditorContent('')
  );
  const { member } = useMemberStore();
  const isOwner = authorId === member?.id;

  const { mutate, isPending } = useDeleteComment();

  const handleEmoji = (emoji: string) => {
    setSelectedEmojis((prev) => {
      const currentCount = prev[emoji] ?? 0;
      return {
        ...prev,
        [emoji]: currentCount + 1,
      };
    });
    setSelectedReaction(emoji);
    setIsEmojiPickerOpen(false);
  };

  const onReply = () => {
    setIsReplying(true);
  };

  const handleReplyCancel = () => {
    setReplyContent(parseEditorContent(''));
    setIsReplying(false);
  };

  const onEdit = () => {
    setEditContent(initialEditContent);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditContent(initialEditContent);
    setIsEditing(false);
  };

  const onDelete = () => {
    mutate(
      {
        teachingNoteId,
        commentId,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      }
      // TODO: 에러처리
    );
  };

  const handleDialogDispatch = (action: DialogAction) => {
    if (action.type === 'CLOSE') {
      setIsDialogOpen(false);
    }
  };

  const handleReactionClick = (emoji: string) => {
    setSelectedEmojis((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] ?? 0) + 1,
    }));
  };

  const card = (
    <div
      className={`border-gray-3 min-h-[154px] w-full rounded-sm border p-6 ${isStudent ? 'bg-gray-1' : 'bg-white'} ${className ?? ''}`}
    >
      {!isEditing && (
        <CommentAnswerCardHeader
          isOwner={isOwner}
          authorName={authorName}
          roleLabel={roleLabel}
          profileImageSrc={profileImageSrc}
          showReaction={showReaction}
          isDeleted={isDeleted}
          selectedEmojis={selectedEmojis}
          isEmojiPickerOpen={isEmojiPickerOpen}
          selectedReaction={selectedReaction}
          isEditing={isEditing}
          onEmojiPickerOpenChange={setIsEmojiPickerOpen}
          onEmojiSelect={handleEmoji}
          onReactionClick={handleReactionClick}
          onEdit={onEdit}
          onReply={onReply}
          setIsDialogOpen={setIsDialogOpen}
        />
      )}
      <CommentAnswerCardContent
        authorName={authorName}
        roleLabel={roleLabel}
        profileImageSrc={profileImageSrc}
        content={content}
        isEditing={isEditing}
        editContent={editContent}
        teachingNoteId={teachingNoteId}
        commentId={commentId}
        expiredAt={expiredAt}
        readCount={readCount}
        isDeleted={isDeleted}
        onEditContentChange={setEditContent}
        onCancel={handleCancel}
      />
    </div>
  );

  const contentNode = !showReplyArrow ? (
    <section>{card}</section>
  ) : (
    <section>
      <div className="flex items-start gap-3">
        <Image
          src="/studynotes/teacher_answer.png"
          alt="reply-arrow"
          width={32}
          height={32}
          className="mt-4 shrink-0"
        />
        {card}
      </div>
    </section>
  );

  return (
    <>
      {contentNode}
      {isReplying ? (
        <CommentReplyComposer
          value={replyContent}
          teachingNoteId={teachingNoteId}
          parentCommentId={commentId}
          onChange={setReplyContent}
          onCancel={handleReplyCancel}
        />
      ) : null}
      <ConfirmDialog
        variant="delete"
        open={isDialogOpen}
        dispatch={handleDialogDispatch}
        onConfirm={onDelete}
        pending={isPending}
        emphasis="none"
        title="삭제하시겠습니까?"
        description="삭제된 댓글은 복구할 수 없습니다."
      />
    </>
  );
};
