'use client';

import Image from 'next/image';

import { useTeacherDashboardReportQuery } from '@/features/dashboard/hooks/use-teacher-dashboard-query';
import { cn } from '@/shared/lib/utils';

import { HeaderReport, type HeaderStat } from './report';

const criticalTextFontClassName =
  '[font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe_UI",sans-serif]';

const TeacherDashboardHeader = ({
  initialMemberName,
}: {
  initialMemberName: string;
}) => {
  const memberName = initialMemberName.trim();
  const hasMemberName = memberName.length > 0;
  const { data: teacherReport, isPending } = useTeacherDashboardReportQuery();

  const stats: HeaderStat[] = [
    {
      value: teacherReport?.studyRoomCount ?? '-',
      unit: '개',
      label: '스터디룸',
    },
    {
      value: teacherReport?.teachingNoteCount ?? '-',
      unit: '개',
      label: '수업노트',
    },
    { value: teacherReport?.studentCount ?? '-', unit: '명', label: '학생' },
    { value: teacherReport?.qnaCount ?? '-', unit: '개', label: '질문' },
  ];

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
            {hasMemberName ? (
              <>
                <span className={cn(criticalTextFontClassName, 'font-bold')}>
                  {memberName}
                </span>{' '}
                선생님,
              </>
            ) : (
              '선생님,'
            )}
            <br />
            오늘은 어떤 수업을 진행하세요?
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

export default TeacherDashboardHeader;
