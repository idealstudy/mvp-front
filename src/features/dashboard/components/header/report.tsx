'use client';

import { cn } from '@/shared/lib';

export interface HeaderStat {
  value: number | '-';
  unit: string;
  label: string;
}

interface HeaderReportProps {
  stats: HeaderStat[];
  isPending?: boolean;
  className?: string;
}

export const HeaderReport = ({
  stats,
  isPending = false,
  className = '',
}: HeaderReportProps) => {
  return (
    <div
      className={cn(
        'border-gray-3 bg-gray-white flex w-fit gap-2 rounded-xl border p-4',
        'tablet:gap-5 tablet:p-6',
        className
      )}
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="tablet:gap-5 flex items-center gap-2"
        >
          <div className="flex w-15.5 flex-col items-center gap-1">
            {isPending ? (
              <>
                <div className="bg-gray-3 tablet:h-6 desktop:h-8 h-5 w-12 animate-pulse rounded" />
                <div className="bg-gray-3 tablet:h-4 h-3.5 w-10 animate-pulse rounded" />
              </>
            ) : (
              <>
                <span
                  className={cn(
                    'text-gray-12 font-body2-heading',
                    'tablet:font-body1-heading desktop:font-headline2-heading'
                  )}
                >
                  {stat.value.toLocaleString()}
                  {stat.unit}
                </span>
                <span className="text-gray-8 font-caption-normal tablet:font-label-normal tracking-[-0.05em]">
                  {stat.label}
                </span>
              </>
            )}
          </div>

          {index !== stats.length - 1 && (
            <div className="bg-gray-3 h-full w-[1px]" />
          )}
        </div>
      ))}
    </div>
  );
};
