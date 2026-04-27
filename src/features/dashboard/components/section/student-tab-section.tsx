'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import {
  useStudentDashboardHomeworkListQuery,
  useStudentDashboardNoteListQuery,
  useStudentDashboardStudyRoomListQuery,
} from '@/features/dashboard/hooks/use-dashboard-query';
import { useStudentNoteList } from '@/features/student-study-note/hooks';
import { AddNoteIcon } from '@/shared/components/icons';
import { Pagination } from '@/shared/components/ui';
import { PRIVATE } from '@/shared/constants';
import { differenceInCalendarDays } from 'date-fns';

import HomeworkSectionContent from '../section-content/homework-section-content';
import NoteSectionContent from '../section-content/note-section-content';
import TabbedSection from './tabbed-section';

const extractTextFromContent = (
  contentJson: string | null | undefined
): string => {
  if (!contentJson) return '';
  try {
    const doc = JSON.parse(contentJson);
    const texts: string[] = [];
    const walk = (node: {
      type?: string;
      text?: string;
      content?: unknown[];
    }) => {
      if (node.text) texts.push(node.text);
      if (node.content)
        node.content.forEach((child) => walk(child as typeof node));
    };
    walk(doc);
    return texts.join(' ');
  } catch {
    return '';
  }
};

// ─── 수업노트 탭 ───────────────────────────────────────────────────────────────

const StudentNoteTabContent = ({ studyRoomId }: { studyRoomId?: number }) => {
  const [page, setPage] = useState(1);

  const { data, isPending } = useStudentDashboardNoteListQuery({
    studyRoomId,
    page: page - 1,
    size: 6,
    sortKey: 'LATEST_EDITED',
  });
  const notes = data?.content ?? [];

  if (isPending) {
    return (
      <div className="tablet:grid tablet:grid-cols-2 tablet:grid-rows-3 flex w-full flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
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

  useEffect(() => {
    setPage(1);
  }, [studyRoomId]);

  const { data, isPending } = useStudentDashboardHomeworkListQuery({
    studyRoomId,
    page: page - 1,
    size: 8,
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
      page={page}
      totalPages={data?.totalPages ?? 0}
      onPageChange={setPage}
      emptyMessage="제출할 과제가 없어요."
    />
  );
};

// ─── 학습노트 탭 ──────────────────────────────────────────────────────────────

const StudentStudyNoteTabContent = () => {
  const [page, setPage] = useState(1);
  const { data, isPending } = useStudentNoteList(page - 1, 5);
  const notes = data?.content ?? [];

  if (isPending) {
    return (
      <div className="tablet:grid tablet:grid-cols-2 tablet:grid-rows-3 flex w-full flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-3 h-[120px] w-full animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="tablet:grid tablet:grid-cols-2 tablet:grid-rows-3 flex w-full flex-col gap-3">
        <Link
          href={PRIVATE.STUDENT_NOTE.CREATE}
          className="bg-gray-1 text-gray-7 border-gray-3 flex w-full items-center justify-center gap-1 rounded-lg border px-8 py-3"
        >
          <AddNoteIcon
            className="h-6 w-6 shrink-0"
            aria-hidden
          />
          <span className="font-body2-normal">추가하기</span>
        </Link>

        {notes.map((note) => (
          <Link
            key={note.id}
            href={PRIVATE.STUDENT_NOTE.DETAIL(note.id)}
            className="bg-orange-1 border-orange-3 flex w-full cursor-pointer flex-col justify-between rounded-lg border px-7 py-7 text-left"
          >
            <div className="flex flex-col gap-1">
              <span className="font-body1-heading text-gray-12 mb-2 line-clamp-2 leading-tight">
                {note.title}
              </span>
              <span className="font-body2-normal text-gray-12 line-clamp-2 leading-tight">
                {extractTextFromContent(note.content)}
              </span>
            </div>
            {note.regDate && (
              <span className="font-label-normal text-gray-7 mt-2 self-end">
                {(() => {
                  const days = differenceInCalendarDays(
                    new Date(),
                    new Date(note.regDate)
                  );
                  if (days === 0) return '오늘';
                  if (days === 7) return '일주일 전';
                  return `${days}일 전`;
                })()}
              </span>
            )}
          </Link>
        ))}
      </div>

      {(data?.totalPages ?? 0) > 1 && (
        <div className="flex justify-center">
          <Pagination
            page={page}
            totalPages={data?.totalPages ?? 0}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

// ─── StudentTabSection ────────────────────────────────────────────────────────
// 학생 대시보드 탭 섹션.
// - 스터디룸 목록을 fetch하고 선택한 스터디룸 ID를 관리합니다.
// - 각 탭 콘텐츠 컴포넌트에 selectedId를 전달해 필터링된 데이터를 보여줍니다.

const STUDENT_TABS = ['수업노트', '학습노트', '과제'];

const StudentTabSection = ({ className }: { className?: string }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: studyRooms = [] } = useStudentDashboardStudyRoomListQuery();

  const content = [
    <StudentNoteTabContent
      key="note"
      studyRoomId={selectedId ?? undefined}
    />,
    <StudentStudyNoteTabContent key="study-note" />,
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
