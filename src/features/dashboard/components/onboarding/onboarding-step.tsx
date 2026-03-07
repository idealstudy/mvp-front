'use client';

import type { ComponentType } from 'react';

import { cn } from '@/shared/lib';

type OnboardingStepVariant = 'incompleted' | 'completed';

interface OnboardingStepProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  variant?: OnboardingStepVariant;
  grouped?: boolean;
  className?: string;
}

const variantStyles: Record<OnboardingStepVariant, string> = {
  incompleted: 'border-gray-3',
  completed:
    'border-orange-6 [&_[data-icon-wrapper]]:bg-orange-6 [&_[data-icon-wrapper]]:text-gray-white',
};

export const OnboardingStep = ({
  icon: Icon,
  label,
  variant = 'incompleted',
  grouped = false,
  className,
}: OnboardingStepProps) => {
  return (
    <div
      className={cn(
        'bg-gray-white tablet:w-fit flex w-fit w-full items-center gap-3 rounded-full border-[1.3px] px-4 py-3 transition-colors',
        variantStyles[variant],
        grouped ? 'border-orange-6 tablet:rounded-none tablet:border-0' : '',
        className
      )}
    >
      <span
        data-icon-wrapper
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full',
          variant === 'incompleted' && !grouped
            ? 'bg-gray-1 text-gray-5'
            : 'bg-orange-6 text-gray-white'
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="font-body2-heading text-gray-12">{label}</span>
    </div>
  );
};
