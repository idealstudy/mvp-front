'use client';

import Link from 'next/link';

import { Button } from '@/shared/components/ui';
import { PUBLIC } from '@/shared/constants';
import { cn } from '@/shared/lib';
import { trackHomeDedu101Click } from '@/shared/lib/gtm/trackers';

export default function FloatingCTA() {
  return (
    <div
      aria-label="선생님 목록 바로가기"
      className={cn(
        'bg-gray-11/80 fixed inset-x-4.5 bottom-6 z-10 flex items-center justify-between rounded-lg p-3',
        'tablet:inset-x-15 tablet:bottom-8 tablet:px-6 tablet:py-4',
        'desktop:gap-7.5 desktop:font-headline1-normal desktop:mx-auto desktop:w-fit'
      )}
    >
      <p
        className={cn(
          'text-gray-scale-white font-label-normal',
          'tablet:font-headline1-normal'
        )}
      >
        <span className="tablet:hidden">
          등록된 디에듀 선생님이 궁금하다면?
        </span>
        <span className="max-tablet:hidden">
          디에듀에 등록된 선생님이 궁금하다면?
        </span>
      </p>
      <Button
        className={cn(
          'font-label-heading h-[35px] px-6',
          'tablet:font-headline2-heading tablet:h-16 tablet:px-20'
        )}
        asChild
      >
        <Link
          href={PUBLIC.CORE.LIST.TEACHERS}
          onClick={() => trackHomeDedu101Click('floating_cta')}
        >
          보러가기
        </Link>
      </Button>
    </div>
  );
}
