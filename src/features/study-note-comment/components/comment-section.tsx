'use client';

import { ColumnLayout } from '@/layout';

import { CommentAnswer } from './comment-answer';
import { CommentQuestion } from './comment-question';
import { CommentWriteArea } from './comment-write-area';

export const StudyNoteDetailCommentSection = () => {
  return (
    <ColumnLayout.Bottom className="space-y-4">
      <section>
        <div className="flex items-center gap-1 text-center">
          <p className="font-body1-heading text-gray-12">댓글</p>
          <p className="font-body1-heading text-orange-7">4</p>
        </div>
      </section>

      <CommentWriteArea />

      <CommentQuestion />

      <CommentAnswer />
    </ColumnLayout.Bottom>
  );
};
