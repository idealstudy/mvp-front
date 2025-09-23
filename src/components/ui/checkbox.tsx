import React from 'react';

import { cn } from '@/lib/utils';
import { Checkbox as CheckboxPrimitives, Label } from 'radix-ui';

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitives.Root>;

const CheckboxImpl = ({
  className,
  'aria-invalid': ariaInvalid,
  ...props
}: CheckboxProps) => {
  return (
    <CheckboxPrimitives.Root
      className={cn(
        'border-line-line3 flex size-[24px] cursor-pointer items-center justify-center rounded-[4px] border',
        'data-[state=checked]:bg-key-color-primary data-[state=checked]:text-gray-scale-white',
        'disabled:border-line-line2 disabled:data-[state=checked]:bg-line-line2 disabled:data-[state=checked]:border-line-line2 disabled:text-line-line1 disabled:pointer-events-none',
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
      width="17"
      height="12"
      viewBox="0 0 17 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
    >
      <path
        d="M1.5 5.5L6.5 10.5L15.5 1.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
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
      className={cn(
        'has-disabled:text-text-inactive flex items-center gap-2',
        className
      )}
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
