'use client';

import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface OnboardingStepGroupProps {
  children: ReactNode;
  className?: string;
}

/** Desktop/Tablet: 마지막 3개 스텝을 주황 테두리로 묶는 컨테이너 */
export const OnboardingStepGroup = ({
  children,
  className,
}: OnboardingStepGroupProps) => {
  return (
    <div
      className={cn(
        'tablet:w-fit tablet:gap-0 tablet:rounded-full tablet:border-[1.3px] tablet:border-orange-6 tablet:bg-gray-white flex gap-2 overflow-hidden',
        className
      )}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <div
            key={index}
            className="flex items-center"
          >
            {child}
            {index < children.length - 1 && (
              <div className="tablet:block bg-gray-3 hidden h-11 w-[1.5px]" />
            )}
          </div>
        ))
      ) : children != null ? (
        <div>{children}</div>
      ) : null}
    </div>
  );
};
