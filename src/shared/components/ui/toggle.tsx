'use client';

import React from 'react';

import { cn } from '@/shared/lib';
import { Switch as SwitchPrimitive } from 'radix-ui';

type ToggleProps = React.ComponentProps<typeof SwitchPrimitive.Root>;

const Toggle = ({ className, ...props }: ToggleProps) => {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200',
        'bg-gray-3',
        'data-[state=checked]:bg-orange-7',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'tablet:h-6 tablet:w-11',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-white shadow-sm transition-transform duration-200',
          'translate-x-0.5 data-[state=checked]:translate-x-4.5',
          'tablet:size-5 tablet:data-[state=checked]:translate-x-5.5'
        )}
      />
    </SwitchPrimitive.Root>
  );
};

export { Toggle };
