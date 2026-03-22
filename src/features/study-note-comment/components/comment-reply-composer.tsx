'use client';

import { parseEditorContent } from '@/shared/components/editor';
import { JSONContent } from '@tiptap/react';

import { CommentComposer } from './comment-composer';

interface CommentReplyComposerProps {
  value: JSONContent;
  studyRoomId: number;
  teachingNoteId: number;
  parentCommentId: number;
  onChange: (value: JSONContent) => void;
  onCancel: () => void;
}

export const CommentReplyComposer = ({
  value,
  studyRoomId,
  teachingNoteId,
  parentCommentId,
  onChange,
  onCancel,
}: CommentReplyComposerProps) => {
  return (
    <CommentComposer
      value={value}
      onChange={onChange}
      studyRoomId={studyRoomId}
      teachingNoteId={teachingNoteId}
      parentCommentId={parentCommentId}
      submitLabel="답글"
      onCancel={onCancel}
      onSubmitted={() => {
        onChange(parseEditorContent(''));
        onCancel();
      }}
      showReplyArrow
    />
  );
};
