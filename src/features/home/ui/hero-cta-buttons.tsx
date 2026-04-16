'use client';

import Link from 'next/link';

import { Button } from '@/shared/components/ui';
import { PUBLIC } from '@/shared/constants';
import { cn } from '@/shared/lib';
import {
  trackHomeDedu101Click,
  trackHomeStartClick,
} from '@/shared/lib/analytics';

export function HeroCtaButtons() {
  return (
    <div className={cn('grid grid-cols-2 gap-2', 'tablet:flex')}>
      <Button
        variant="secondary"
        size="xsmall"
        asChild
        className={cn(
          'font-label-normal',
          'tablet:h-13.5 tablet:px-12 tablet:font-body2-normal'
        )}
      >
        <Link
          href={PUBLIC.CORE.LIST.TEACHERS}
          onClick={() => trackHomeDedu101Click('hero')}
        >
          등록된 선생님 보러가기
        </Link>
      </Button>
      <Button
        size="xsmall"
        asChild
        className={cn(
          'font-label-heading',
          'tablet:h-13.5 tablet:px-12 tablet:font-body2-heading'
        )}
      >
        <Link
          href={PUBLIC.CORE.SIGNUP}
          onClick={trackHomeStartClick}
        >
          디에듀 시작하기
        </Link>
      </Button>
    </div>
  );
}
