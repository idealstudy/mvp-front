import React from 'react';

import { cn } from '@/lib/utils';

type InputProps = React.ComponentPropsWithRef<'input'>;

export const Input = ({
  className,
  'aria-invalid': ariaInvalid,
  ...props
}: InputProps) => {
  return (
    <input
      className={cn(
        'border-line-line2 placeholder:text-gray-scale-gray-50 h-[56px] w-full rounded-[4px] border px-[24px] outline-none',
        'focus-visible:border-line-line3',
        'disabled:border-text-inactive disabled:bg-gray-scale-gray-1 disabled:text-text-inactive',
        'read-only:border-light-gray-30 read-only:gray-scale-gray-5 read-only:text-gray-scale-gray-50',
        ariaInvalid &&
          'border-system-warning focus-visible:border-system-warning',
        className
      )}
      aria-invalid={ariaInvalid}
      {...props}
    />
  );
};
