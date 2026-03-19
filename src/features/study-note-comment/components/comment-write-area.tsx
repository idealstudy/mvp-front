'use client';

import {
  initialTextEditorValue,
  useTextEditor,
} from '@/shared/components/editor';

import { CommentComposer } from './comment-composer';

interface WriteAreaProps {
  teachingNoteId: number;
}

export const CommentWriteArea = ({ teachingNoteId }: WriteAreaProps) => {
  const textEditor = useTextEditor();

  return (
    <CommentComposer
      value={textEditor.value}
      onChange={textEditor.onChange}
      teachingNoteId={teachingNoteId}
      parentCommentId={null}
      submitLabel="댓글"
      onSubmitted={() => {
        textEditor.onChange(initialTextEditorValue);
      }}
    />
  );
};
