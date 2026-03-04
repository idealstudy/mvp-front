'use client';

import { useState } from 'react';

import {
  useStudentDashboardHomeworkListQuery,
  useStudentDashboardNoteListQuery,
  useStudentDashboardStudyRoomListQuery,
} from '@/features/dashboard/hooks/use-dashboard-query';

import HomeworkSectionContent from '../section-content/homework-section-content';
import NoteSectionContent from '../section-content/note-section-content';
import TabbedSection from './tabbed-section';

// ─── 수업노트 탭 ───────────────────────────────────────────────────────────────

const StudentNoteTabContent = ({ studyRoomId }: { studyRoomId?: number }) => {
  const [page, setPage] = useState(0);

  const { data } = useStudentDashboardNoteListQuery({
    studyRoomId,
    page,
    size: 6,
    sortKey: 'LATEST_EDITED',
  });
  const notes = data?.content ?? [];

  if (notes.length === 0) {
    return (
      <div className="flex h-22 w-full items-center justify-center">
        <p className="font-body2-normal text-gray-8">수업노트가 없어요.</p>
      </div>
    );
  }

  return (
    <NoteSectionContent
      notes={notes}
      page={page}
      totalPages={data?.totalPages ?? 0}
      onPageChange={setPage}
    />
  );
};

// ─── 과제 탭 ──────────────────────────────────────────────────────────────────

const StudentHomeworkTabContent = ({
  studyRoomId,
}: {
  studyRoomId?: number;
}) => {
  const [page, setPage] = useState(1);

  const { data } = useStudentDashboardHomeworkListQuery({
    studyRoomId,
    page: page - 1,
    size: 8,
    sortKey: 'DEADLINE_IMMINENT',
  });

  return (
    <HomeworkSectionContent
      homeworks={data?.content ?? []}
      page={page}
      totalPages={data?.totalPages ?? 0}
      onPageChange={setPage}
      emptyMessage="제출할 과제가 없어요."
    />
  );
};

// ─── StudentTabSection ────────────────────────────────────────────────────────
// 학생 대시보드 탭 섹션.
// - 스터디룸 목록을 fetch하고 선택한 스터디룸 ID를 관리합니다.
// - 각 탭 콘텐츠 컴포넌트에 selectedId를 전달해 필터링된 데이터를 보여줍니다.

const STUDENT_TABS = ['수업노트', '과제'];

const StudentTabSection = ({ className }: { className?: string }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: studyRooms = [] } = useStudentDashboardStudyRoomListQuery();

  const content = [
    <StudentNoteTabContent
      key="note"
      studyRoomId={selectedId ?? undefined}
    />,
    <StudentHomeworkTabContent
      key="homework"
      studyRoomId={selectedId ?? undefined}
    />,
  ];

  return (
    <TabbedSection
      studyRooms={studyRooms}
      selectedId={selectedId}
      onSelectStudyRoom={setSelectedId}
      tabs={STUDENT_TABS}
      content={content}
      className={className}
    />
  );
};

export default StudentTabSection;
