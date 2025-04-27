import React from 'react';

import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';

export type ButtonProps = React.ComponentPropsWithRef<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const buttonVariants = cva(
  cn(
    'inline-flex justify-center items-center cursor-pointer whitespace-nowrap',
    'disabled:pointer-events-none'
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'bg-dedu-orange text-white border border-black hover:bg-dedu-orange-hover font-bold',
          'disabled:bg-gray-200 disabled:text-[#B3B3B3] disabled:border-[#CDCDCD]'
        ),
        secondary: cn(
          'bg-white text-dedu-black font-normal border border-dark-gray-03 hover:bg-[#EEEEEE]',
          'disabled:border-light-gray-03 disabled:text-light-gray-03'
        ),
      },
      size: {
        large: 'h-[64px] px-[26px] text-[20px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'large',
    },
  }
);

export const Button = ({
  className,
  variant,
  size,
  children,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Component = asChild ? Slot.Root : 'button';

  return (
    <Component
      type={asChild ? undefined : 'button'}
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {children}
    </Component>
  );
};
