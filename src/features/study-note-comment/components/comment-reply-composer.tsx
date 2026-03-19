'use client';

import { parseEditorContent } from '@/shared/components/editor';
import { JSONContent } from '@tiptap/react';

import { CommentComposer } from './comment-composer';

interface CommentReplyComposerProps {
  value: JSONContent;
  teachingNoteId: number;
  parentCommentId: number;
  onChange: (value: JSONContent) => void;
  onCancel: () => void;
}

export const CommentReplyComposer = ({
  value,
  teachingNoteId,
  parentCommentId,
  onChange,
  onCancel,
}: CommentReplyComposerProps) => {
  return (
    <CommentComposer
      value={value}
      onChange={onChange}
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
