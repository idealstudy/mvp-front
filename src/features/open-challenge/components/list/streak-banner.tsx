'use client';

import { cn } from '@/shared/lib';
import { Check, Flame } from 'lucide-react';

type StreakBannerProps = {
  streakDays: number;
  todayCompleted: boolean;
};

const TOTAL_DAYS = 7;

export const StreakBanner = ({
  streakDays,
  todayCompleted,
}: StreakBannerProps) => {
  return (
    <div className="border-line-line1 flex flex-col gap-4 rounded-xl border bg-white px-6 py-5 sm:flex-row sm:items-center sm:gap-8">
      <div className="flex shrink-0 items-center gap-4">
        <div className="bg-orange-1 flex h-14 w-14 items-center justify-center rounded-full">
          <Flame
            size={28}
            className="text-orange-7"
          />
        </div>
        <div>
          <p className="text-orange-7 font-body1-heading">
            {streakDays}일 연속 도전 중이에요 🔥
          </p>
          <p className="text-gray-8 font-caption-normal mt-0.5 text-sm">
            매일 도전하고 실력을 키워보세요!
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center gap-3 sm:gap-5">
        {Array.from({ length: TOTAL_DAYS }, (_, i) => {
          const day = i + 1;
          const isCompleted =
            day < streakDays || (day === streakDays && todayCompleted);
          const isCurrent = day === streakDays && !todayCompleted;

          return (
            <div
              key={day}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors sm:h-10 sm:w-10',
                  isCompleted && 'bg-orange-7 text-white',
                  isCurrent &&
                    'border-orange-7 text-orange-7 border-2 bg-white',
                  !isCompleted && !isCurrent && 'bg-gray-1 text-gray-6'
                )}
              >
                {isCompleted && <Check size={16} />}
              </div>
              <span className="text-gray-8 text-xs">{day}일차</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
