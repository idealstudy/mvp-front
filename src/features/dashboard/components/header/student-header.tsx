'use client';

import Image from 'next/image';

import { useStudentDashboardReportQuery } from '@/features/dashboard/hooks/use-student-dashboard-query';
import { cn } from '@/shared/lib';
import { useMemberStore } from '@/store';

import { HeaderReport, type HeaderStat } from './report';

const StudentDashboardHeader = () => {
  const memberName = useMemberStore((s) => s.member?.name);
  const { data: studentReport, isPending } = useStudentDashboardReportQuery();

  const stats: HeaderStat[] = [
    {
      value: studentReport?.studyRoomCount ?? '-',
      unit: '개',
      label: '스터디룸',
    },
    {
      value: studentReport?.questionCount ?? '-',
      unit: '개',
      label: '나의 질문',
    },
    {
      value: studentReport?.answerCount ?? '-',
      unit: '개',
      label: '수집한 답변',
    },
    {
      value: studentReport?.submittedHomeworkCount ?? '-',
      unit: '개',
      label: '제출한 과제',
    },
  ];

  const criticalTextFontClassName =
    '[font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe_UI",sans-serif]';

  return (
    <div
      className={cn(
        'bg-system-background flex flex-col items-center gap-3 px-4.5 pt-8 pb-3',
        'tablet:pt-19 tablet:px-20 tablet:pb-0'
      )}
    >
      <div className="relative flex h-fit w-full items-end justify-between">
        <div
          className={cn(
            'flex h-25 min-w-0 flex-col gap-6',
            'tablet:h-50 desktop:h-55'
          )}
        >
          <p
            className={cn(
              criticalTextFontClassName,
              'font-body1-normal text-gray-black',
              'tablet:font-headline1-normal desktop:font-title-normal'
            )}
          >
            <span className={cn(criticalTextFontClassName, 'font-bold')}>
              {memberName}
            </span>{' '}
            님,
            <br />
            학습기록이 차곡차곡 쌓이고 있어요
          </p>
          <HeaderReport
            className="tablet:flex hidden"
            stats={stats}
            isPending={isPending}
          />
        </div>

        <div className="absolute top-0 right-0">
          <Image
            src="/dashboard/dashboard-character.png"
            alt="대시보드 캐릭터"
            width={220}
            height={220}
            priority
            fetchPriority="high"
            sizes="(min-width: 1200px) 220px, (min-width: 768px) 200px, 100px"
            className={cn(
              'h-25 w-25 object-contain',
              'tablet:w-50 tablet:h-50 desktop:w-55 desktop:h-55'
            )}
          />
        </div>
      </div>
      <HeaderReport
        className="tablet:hidden flex"
        stats={stats}
        isPending={isPending}
      />
    </div>
  );
};

export default StudentDashboardHeader;
