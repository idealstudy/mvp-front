'use client';

import Image from 'next/image';

import { useParentDashboardReportQuery } from '@/features/dashboard/hooks/use-parent-dashboard-query';
import { cn } from '@/shared/lib';

import { HeaderReport, type HeaderStat } from './report';

const ParentDashboardHeader = ({
  initialMemberName,
}: {
  initialMemberName: string;
}) => {
  const memberName = initialMemberName.trim();
  const hasMemberName = memberName.length > 0;
  const { data: parentReport, isPending } = useParentDashboardReportQuery();

  const stats: HeaderStat[] = [
    { value: parentReport?.studyNews ?? '-', unit: '개', label: '학습 소식' },
    {
      value: parentReport?.waitingInquiries ?? '-',
      unit: '건',
      label: '답변 대기',
    },
    {
      value: parentReport?.answeredInquiries ?? '-',
      unit: '건',
      label: '답변 완료',
    },
    {
      value: parentReport?.myStudentCount ?? '-',
      unit: '명',
      label: '매칭된 학생',
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
            {hasMemberName ? (
              <>
                <span className={cn(criticalTextFontClassName, 'font-bold')}>
                  {memberName}
                </span>{' '}
                학부모님,
              </>
            ) : (
              '학부모님,'
            )}
            <br />
            학습 여정을 함께 확인해보세요
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

export default ParentDashboardHeader;
