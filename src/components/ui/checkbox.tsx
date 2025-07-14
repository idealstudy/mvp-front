import React from 'react';

import { cn } from '@/lib/utils';
import { Checkbox as CheckboxPrimitives, Label } from 'radix-ui';

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitives.Root>;

const CheckboxImpl = ({
  className,
  ['aria-invalid']: ariaInvalid,
  ...props
}: CheckboxProps) => {
  return (
    <CheckboxPrimitives.Root
      className={cn(
        'border-line-line3 flex size-[24px] cursor-pointer items-center justify-center border',
        'data-[state=checked]:bg-key-color-primary',
        'disabled:border-gray-scale-gray-10 disabled:data-[state=checked]:bg-gray-scale-gray-10 disabled:data-[state=checked]:border-line-line1 disabled:pointer-events-none',
        ariaInvalid && '',
        className
      )}
      aria-invalid={ariaInvalid}
      {...props}
    >
      <CheckboxPrimitives.Indicator>
        <CheckIcon />
      </CheckboxPrimitives.Indicator>
    </CheckboxPrimitives.Root>
  );
};

const CheckIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="11"
      viewBox="0 0 15 11"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.172 0L4.72409 9.44793L5.4312 10.155L14.8791 0.707107L14.172 0ZM0 4.72388L4.72397 9.44784L5.43107 8.74074L0.707107 4.01677L0 4.72388Z"
        fill="white"
      />
    </svg>
  );
};

type CheckboxLabelProps = React.ComponentProps<typeof Label.Root>;

const CheckboxLabel = ({
  className,
  children,
  ...props
}: CheckboxLabelProps) => {
  return (
    <Label.Root
      className={cn('flex items-center gap-4', className)}
      {...props}
    >
      {children}
    </Label.Root>
  );
};

type CheckboxGroupProps = React.ComponentPropsWithRef<'div'>;

const CheckboxGroup = ({ children, ...props }: CheckboxGroupProps) => {
  return (
    <div
      role="group"
      {...props}
    >
      {children}
    </div>
  );
};

export const Checkbox = Object.assign(CheckboxImpl, {
  Label: CheckboxLabel,
  Group: CheckboxGroup,
});
