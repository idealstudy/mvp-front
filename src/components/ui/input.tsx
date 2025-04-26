import React from 'react';

import { cn } from '@/lib/utils';

type InputProps = React.ComponentPropsWithRef<'input'>;

export const Input = ({
  className,
  ['aria-invalid']: ariaInvalid,
  ...props
}: InputProps) => {
  return (
    <input
      className={cn(
        'border-dark-gray-03 placeholder:text-dark-gray-03 h-[56px] w-full border px-[24px] outline-none',
        'focus-visible:border-dedu-black',
        'disabled:border-light-gray-30 disabled:bg-light-gray-01 disabled:text-dark-gray-03',
        'read-only:border-light-gray-30 read-only:bg-light-gray-01 read-only:text-dark-gray-03',
        ariaInvalid && 'border-red focus-visible:border-red',
        className
      )}
      aria-invalid={ariaInvalid}
      {...props}
    />
  );
};
