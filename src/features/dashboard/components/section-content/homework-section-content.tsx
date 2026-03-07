'use client';

import Link from 'next/link';

import { StudentDashboardHomeworkListItemDTO } from '@/entities/student';
import { TeacherDashboardHomeworkListItemDTO } from '@/entities/teacher';
import { Pagination } from '@/shared/components/ui/pagination';
import { PRIVATE } from '@/shared/constants/route';
import { cn } from '@/shared/lib';
import { trackDashboardHomeworkClick } from '@/shared/lib/gtm/trackers';
import { useMemberStore } from '@/store';

type DeadlineLabel = 'UPCOMING' | 'TODAY' | 'OVERDUE';

export interface HomeworkSectionContentProps {
  homeworks:
    | TeacherDashboardHomeworkListItemDTO[]
    | StudentDashboardHomeworkListItemDTO[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  emptyMessage?: string;
}

const formatDeadlineLabel = (label: DeadlineLabel, dday: number) => {
  if (label === 'UPCOMING') return `D-${dday}`;
  if (label === 'TODAY') return 'D-day';
  return '마감';
};

const HomeworkSectionContent = ({
  homeworks,
  page,
  totalPages,
  onPageChange,
  emptyMessage = '과제가 없어요.',
}: HomeworkSectionContentProps) => {
  const member = useMemberStore((s) => s.member);
  if (homeworks.length === 0) {
    return (
      <div className="flex h-22 w-full items-center justify-center">
        <p className="font-body2-normal text-gray-8">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className={cn('flex w-full flex-col gap-3')}>
        {homeworks.map((homework) => {
          return (
            <Link
              key={homework.id}
              href={PRIVATE.HOMEWORK.DETAIL(homework.studyRoomId, homework.id)}
              className="bg-gray-white flex flex-col gap-0.5 rounded-xl p-3 shadow-none transition-shadow hover:shadow-sm"
              onClick={() =>
                trackDashboardHomeworkClick(
                  homework.studyRoomId,
                  homework.id,
                  member?.role
                )
              }
            >
              <span className="font-body2-normal text-gray-12">
                {homework.title}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-caption-normal text-gray-8 bg-gray-1 rounded-md p-1">
                  제출율 {homework.submittedRatePercent}%
                </span>
                <span className="font-caption-normal text-gray-8">
                  {homework.regDate.split('T')[0]?.replaceAll('-', '.')} 생성
                </span>
                <span
                  className={cn(
                    'font-caption-heading shrink-0 rounded-[4px] px-2 py-1',
                    homework.deadlineLabel === 'OVERDUE'
                      ? 'bg-gray-2 text-gray-7'
                      : 'bg-orange-2 text-orange-7'
                  )}
                >
                  {formatDeadlineLabel(homework.deadlineLabel, homework.dday)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
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

export default HomeworkSectionContent;
