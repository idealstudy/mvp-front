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
          'bg-key-color-primary text-white border border-black hover:bg-orange-scale-orange-60 font-bold',
          'disabled:bg-gray-200 disabled:text-[#B3B3B3] disabled:border-[#CDCDCD]'
        ),
        secondary: cn(
          'bg-white text-text-main font-normal border border-gray-scale-gray-50 hover:bg-[#EEEEEE]',
          'disabled:border-gray-scale-gray-10 disabled:text-text-reversed-sub2'
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
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Component>
  );
};
