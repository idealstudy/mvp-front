'use client';

import { NoteBottomSkeleton } from '@/features/dashboard/studynote/detail/components/note-skeleton';
import { ColumnLayout } from '@/layout';
import { useRole } from '@/shared/hooks';

import { useCommentList, useParentCommentList } from '../hooks/use-comment';
import { CommentItem } from './comment-item';
import { CommentWriteArea } from './comment-write-area';

interface StudyNoteDetailCommentSectionProps {
  studyRoomId: string;
  studyNoteId: string;
  studentId?: string;
}

export const StudyNoteDetailCommentSection = ({
  studyRoomId,
  studyNoteId,
  studentId,
}: StudyNoteDetailCommentSectionProps) => {
  const teachingNoteId = Number(studyNoteId);
  const parsedStudyRoomId = Number(studyRoomId);
  const parentStudentId = studentId ? Number(studentId) : null;
  const hasValidParentStudentId =
    parentStudentId !== null &&
    Number.isInteger(parentStudentId) &&
    parentStudentId > 0;

  const { role, isLoading: isRoleLoading } = useRole();
  const isParent = role === 'ROLE_PARENT';

  const {
    data: commonCommentData,
    isPending: commonIsPending,
    isError: commonIsError,
  } = useCommentList(teachingNoteId, !isRoleLoading && !isParent);
  const {
    data: parentCommentData,
    isPending: parentIsPending,
    isError: parentIsError,
  } = useParentCommentList(
    parentStudentId ?? 0,
    teachingNoteId,
    !isRoleLoading && isParent && hasValidParentStudentId
  );

  const data = isParent ? parentCommentData : commonCommentData;
  const comments = data ?? [];

  const isPending =
    isRoleLoading || (isParent ? parentIsPending : commonIsPending);
  const isError = isParent ? parentIsError : commonIsError;

  if (isParent && !hasValidParentStudentId) {
    return null;
  }

  if (isPending) return <NoteBottomSkeleton />;

  if (isError) {
    return (
      <p className="flex flex-col items-center">
        댓글 목록을 불러오는 중 오류가 발생했습니다.
      </p>
    );
  }

  const totalCommentCount = comments.reduce(
    (count, comment) => count + 1 + comment.children.length,
    0
  );

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

      {!isParent && (
        <CommentWriteArea
          studyRoomId={parsedStudyRoomId}
          teachingNoteId={teachingNoteId}
        />
      )}

      {comments.length === 0 ? (
        <p className="flex flex-col items-center">아직 등록된 댓글이 없어요.</p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="space-y-4"
          >
            <CommentItem
              studyRoomId={parsedStudyRoomId}
              teachingNoteId={teachingNoteId}
              comment={comment}
            />
            {comment.children.map((item) => (
              <CommentItem
                key={item.id}
                studyRoomId={parsedStudyRoomId}
                teachingNoteId={teachingNoteId}
                comment={item}
                showReplyArrow
              />
            ))}
          </div>
        ))
      )}
    </ColumnLayout.Bottom>
  );
};
