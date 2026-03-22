'use client';

import { NoteBottomSkeleton } from '@/features/dashboard/studynote/detail/components/note-skeleton';
import { ColumnLayout } from '@/layout';

import { useCommentList } from '../hooks/use-comment';
import { CommentItem } from './comment-item';
import { CommentWriteArea } from './comment-write-area';

interface StudyNoteDetailCommentSectionProps {
  studyRoomId: string;
  studyNoteId: string;
}

export const StudyNoteDetailCommentSection = ({
  studyRoomId,
  studyNoteId,
}: StudyNoteDetailCommentSectionProps) => {
  const teachingNoteId = Number(studyNoteId);
  const parsedStudyRoomId = Number(studyRoomId);
  const { data, isPending, isError } = useCommentList(teachingNoteId);

  if (isPending) return <NoteBottomSkeleton />;

  if (isError) {
    return (
      <p className="flex flex-col items-center">
        댓글 목록을 불러오는 중 오류가 발생했습니다.
      </p>
    );
  }

  if (!data) {
    return (
      <p className="flex flex-col items-center">아직 등록된 댓글이 없어요.</p>
    );
  }

  const totalCommentCount =
    data.reduce((count, comment) => count + 1 + comment.children.length, 0) ??
    0;

  return (
    <ColumnLayout.Bottom className="space-y-4">
      <section>
        <div className="flex items-center gap-1 text-center">
          <p className="font-body1-heading text-gray-12">댓글</p>
          <p className="font-body1-heading text-orange-7">
            {totalCommentCount}
          </p>
        </div>
      </section>

      <CommentWriteArea
        studyRoomId={parsedStudyRoomId}
        teachingNoteId={teachingNoteId}
      />

      {data.map((comment) => (
        <div
          key={comment.id}
          className="space-y-4"
        >
          <CommentItem
            studyRoomId={parsedStudyRoomId}
            teachingNoteId={teachingNoteId}
            comment={comment}
          />
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              studyRoomId={parsedStudyRoomId}
              teachingNoteId={teachingNoteId}
              comment={child}
              showReplyArrow
            />
          ))}
        </div>
      ))}
    </ColumnLayout.Bottom>
  );
};
