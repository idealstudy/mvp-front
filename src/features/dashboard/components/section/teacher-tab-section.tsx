'use client';

import { useState } from 'react';

import {
  useTeacherDashboardHomeworkListQuery,
  useTeacherDashboardMemberListQuery,
  useTeacherDashboardNoteListQuery,
  useTeacherDashboardStudyRoomListQuery,
} from '@/features/dashboard/hooks/use-dashboard-query';

import HomeworkSectionContent from '../section-content/homework-section-content';
import NoteSectionContent from '../section-content/note-section-content';
import StudentsSectionContent from '../section-content/student-section-content';
import TabbedSection from './tabbed-section';

// ─── 수업노트 탭 ───────────────────────────────────────────────────────────────

const TeacherNoteTabContent = ({
  studyRoomId,
  lastStudyRoomId,
}: {
  studyRoomId?: number;
  lastStudyRoomId?: number;
}) => {
  const [page, setPage] = useState(0);

  const { data } = useTeacherDashboardNoteListQuery({
    studyRoomId,
    page,
    size: 5,
    sortKey: 'LATEST_EDITED',
  });
  const notes = data?.content ?? [];

  if (notes.length === 0) {
    return (
      <div className="flex h-22 w-full items-center justify-center">
        <p className="font-body2-normal text-gray-8">
          작성한 수업노트가 없어요.
        </p>
      </div>
    );
  }

  return (
    <NoteSectionContent
      notes={notes}
      page={page}
      totalPages={data?.totalPages ?? 0}
      onPageChange={setPage}
      lastStudyRoomId={lastStudyRoomId}
    />
  );
};

// ─── 멤버 탭 ──────────────────────────────────────────────────────────────────
// studyRoomId가 null(전체)이면 0을 전달해 전체 멤버를 조회합니다.

const TeacherMemberTabContent = ({ studyRoomId }: { studyRoomId?: number }) => {
  const [page, setPage] = useState(0);

  const { data } = useTeacherDashboardMemberListQuery({
    studyRoomId,
    page,
    size: 10,
    sortKey: 'LATEST',
  });

  return (
    <StudentsSectionContent
      students={data?.content ?? []}
      page={page}
      totalPages={data?.totalPages ?? 0}
      onPageChange={setPage}
    />
  );
};

// ─── 과제 탭 ──────────────────────────────────────────────────────────────────

const TeacherHomeworkTabContent = ({
  studyRoomId,
}: {
  studyRoomId?: number;
}) => {
  const { data } = useTeacherDashboardHomeworkListQuery({
    studyRoomId,
    page: 0,
    size: 4,
    sortKey: 'DEADLINE_IMMINENT',
  });

  return (
    <HomeworkSectionContent
      homeworks={data?.content ?? []}
      page={0}
      totalPages={data?.totalPages ?? 0}
      onPageChange={() => {}}
      emptyMessage="등록된 과제가 없어요."
    />
  );
};

// ─── TeacherTabSection ────────────────────────────────────────────────────────
// 선생님 대시보드 탭 섹션.
// - 스터디룸 목록을 fetch하고 선택한 스터디룸 ID를 관리합니다.
// - selectedId가 null(전체)이면 모든 탭에서 전체 데이터를 조회합니다.

const TEACHER_TABS = ['수업노트', '멤버', '과제'];

const TeacherTabSection = ({ className }: { className?: string }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: studyRooms = [] } = useTeacherDashboardStudyRoomListQuery();

  const content = [
    <TeacherNoteTabContent
      key="note"
      studyRoomId={selectedId ?? undefined}
      lastStudyRoomId={selectedId ?? studyRooms[0]?.id}
    />,
    <TeacherMemberTabContent
      key="member"
      studyRoomId={selectedId ?? undefined}
    />,
    <TeacherHomeworkTabContent
      key="homework"
      studyRoomId={selectedId ?? undefined}
    />,
  ];

  return (
    <TabbedSection
      studyRooms={studyRooms}
      selectedId={selectedId}
      onSelectStudyRoom={setSelectedId}
      tabs={TEACHER_TABS}
      content={content}
      className={className}
    />
  );
};

export default TeacherTabSection;
