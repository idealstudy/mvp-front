'use client';

import type {
  CommentChildItem as CommentChildItemModel,
  CommentItem as CommentItemModel,
} from '@/entities/study-note-comment';

import { CommentCard } from './comment-card';

type CommentCardItem = CommentItemModel | CommentChildItemModel;

interface CommentItemProps {
  teachingNoteId: number;
  comment: CommentCardItem;
  showReplyArrow?: boolean;
}

export const CommentItem = ({
  teachingNoteId,
  comment,
  showReplyArrow = false,
}: CommentItemProps) => {
  return (
    <CommentCard
      authorId={comment.authorInfo.id}
      authorName={comment.authorInfo.name}
      roleLabel={comment.authorInfo.roleLabel}
      content={comment.resolvedContent.content}
      expiredAt={comment.resolvedContent.expiresAt}
      readCount={comment.readCount}
      isStudent={comment.authorInfo.isStudent}
      showReplyArrow={showReplyArrow}
      profileImageSrc={comment.authorInfo.profileImageSrc}
      teachingNoteId={teachingNoteId}
      commentId={comment.id}
      isDeleted={comment.isDeleted}
    />
  );
};
