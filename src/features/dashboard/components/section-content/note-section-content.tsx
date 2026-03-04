import Link from 'next/link';

import { StudentDashboardNoteListItemDTO } from '@/entities/student';
import { TeacherDashboardNoteListItemDTO } from '@/entities/teacher';
import { AddNoteIcon } from '@/shared/components/icons';
import { Pagination } from '@/shared/components/ui';
import { PRIVATE } from '@/shared/constants';

type NoteItem =
  | TeacherDashboardNoteListItemDTO
  | StudentDashboardNoteListItemDTO;

interface NoteSectionContentProps {
  notes: NoteItem[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  lastStudyRoomId?: number;
}

const NoteSectionContent = ({
  notes,
  page,
  totalPages,
  onPageChange,
  lastStudyRoomId,
}: NoteSectionContentProps) => {
  const isTeacher = lastStudyRoomId !== undefined;
  const hasStudyRoom = (lastStudyRoomId ?? 0) > 0;

  return (
    <div className="flex w-full flex-col gap-3">
      {isTeacher && !hasStudyRoom && (
        <p className="font-body2-normal text-gray-8">
          상단을 참고해 스터디룸을 생성하고 학생을 초대한 후, 이용할 수 있어요.
        </p>
      )}

      {/* 그리드: tablet부터 3열 2행 */}
      <div className="tablet:grid tablet:grid-cols-2 tablet:grid-rows-3 flex w-full flex-col gap-3">
        {/* 새 노트 추가하기 버튼 (Teacher 전용) */}
        {isTeacher && hasStudyRoom && (
          <Link
            href={PRIVATE.NOTE.CREATE(lastStudyRoomId!)}
            className="bg-gray-1 text-gray-7 border-gray-3 flex w-full items-center justify-center gap-1 rounded-lg border-1 px-8 py-3"
          >
            <AddNoteIcon
              className="h-6 w-6 shrink-0"
              aria-hidden
            />
            <span className="font-body2-normal">추가하기</span>
          </Link>
        )}

        {/* 노트 목록 */}
        {notes.map((note) => (
          <Link
            key={note.id}
            href={PRIVATE.NOTE.DETAIL(note.studyRoomId, note.id)}
            className="bg-orange-1 border-orange-3 flex w-full cursor-pointer flex-col items-start gap-1 rounded-lg border px-7 py-7 text-left"
          >
            <span className="font-label-heading text-orange-7">
              {note.studyRoomName}
            </span>
            <span className="font-body1-heading text-gray-12 mb-2 line-clamp-2 leading-tight">
              {note.title}
            </span>
            <span className="font-body2-normal text-gray-12 line-clamp-2 leading-tight">
              {note.contentPreview}
            </span>
          </Link>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default NoteSectionContent;
