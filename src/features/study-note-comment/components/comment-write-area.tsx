'use client';

import {
  initialTextEditorValue,
  useTextEditor,
} from '@/shared/components/editor';

import { CommentComposer } from './comment-composer';

interface WriteAreaProps {
  studyRoomId: number;
  teachingNoteId: number;
}

export const CommentWriteArea = ({
  studyRoomId,
  teachingNoteId,
}: WriteAreaProps) => {
  const textEditor = useTextEditor();

  return (
    <CommentComposer
      value={textEditor.value}
      onChange={textEditor.onChange}
      studyRoomId={studyRoomId}
      teachingNoteId={teachingNoteId}
      parentCommentId={null}
      submitLabel="댓글"
      onSubmitted={() => {
        textEditor.onChange(initialTextEditorValue);
      }}
    />
  );
};
