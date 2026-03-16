'use client';

import { useState } from 'react';

import Image from 'next/image';

import { ConfirmDialog, type DialogAction } from '@/shared/components/dialog';
import {
  hasMeaningfulEditorContent,
  parseEditorContent,
} from '@/shared/components/editor';
import { JSONContent } from '@tiptap/react';

import { CommentAnswerCardContent } from './comment-answer-card-content';
import { CommentAnswerCardHeader } from './comment-answer-card-header';
import { CommentReplyComposer } from './comment-reply-composer';

interface CommentAnswerCardProps {
  authorName: string;
  roleLabel?: string;
  content: string;
  profileImageSrc: string;
  showReplyArrow?: boolean;
  showReaction?: boolean;
  className?: string;
}

export const CommentCard = ({
  authorName,
  roleLabel,
  content,
  profileImageSrc,
  showReplyArrow = false,
  showReaction = true,
  className,
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
  const isReplySubmitDisabled = !hasMeaningfulEditorContent(replyContent);

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

  // 답장 남기기
  const onReply = () => {
    setIsReplying(true);
  };

  const handleReplyCancel = () => {
    setReplyContent(parseEditorContent(''));
    setIsReplying(false);
  };

  // 수정하기
  const onEdit = () => {
    setEditContent(initialEditContent);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditContent(initialEditContent);
    setIsEditing(false);
  };

  // 삭제하기
  const onDelete = () => {
    alert('삭제');
    setIsDialogOpen(false);
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
      className={`border-gray-3 min-h-[154px] w-full rounded-sm border p-6 ${roleLabel === '학생' ? 'bg-gray-1' : 'bg-white'} ${className ?? ''}`}
    >
      {!isEditing && (
        <CommentAnswerCardHeader
          authorName={authorName}
          roleLabel={roleLabel}
          profileImageSrc={profileImageSrc}
          showReaction={showReaction}
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
          alt="답변"
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
          isSubmitDisabled={isReplySubmitDisabled}
          onChange={setReplyContent}
          onCancel={handleReplyCancel}
        />
      ) : null}
      <ConfirmDialog
        variant="delete"
        open={isDialogOpen}
        dispatch={handleDialogDispatch}
        onConfirm={onDelete}
        emphasis="none"
        title="삭제하시겠습니까?"
        description="삭제된 댓글은 복구할 수 없습니다."
      />
    </>
  );
};
