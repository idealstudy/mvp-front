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

  const { data, isPending } = useTeacherDashboardNoteListQuery({
    studyRoomId,
    page,
    size: 5,
    sortKey: 'LATEST_EDITED',
  });
  const notes = data?.content ?? [];

  if (isPending) {
    return (
      <div className="tablet:grid tablet:grid-cols-2 tablet:grid-rows-3 flex w-full flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-3 h-[120px] w-full animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

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

  const { data, isPending } = useTeacherDashboardMemberListQuery({
    studyRoomId,
    page,
    size: 10,
    sortKey: 'LATEST',
  });

  if (isPending) {
    return (
      <div className="flex w-full flex-col">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-3"
          >
            <div className="bg-gray-3 h-9 w-9 shrink-0 animate-pulse rounded-full" />
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="bg-gray-3 h-4 w-24 animate-pulse rounded" />
              <div className="bg-gray-3 h-3 w-40 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

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
  const { data, isPending } = useTeacherDashboardHomeworkListQuery({
    studyRoomId,
    page: 0,
    size: 4,
    sortKey: 'DEADLINE_IMMINENT',
  });

  if (isPending) {
    return (
      <div className="flex w-full flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-3 h-14 w-full animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

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
