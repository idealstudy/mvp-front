'use client';

import React from 'react';

import { createContextFactory } from '@/lib/context';
import { cn } from '@/lib/utils';
import { Select as SelectPrimitives } from 'radix-ui';

type SelectChevronDownIconProps = {
  className?: string;
};

export const SelectChevronDownIcon = ({
  className,
}: SelectChevronDownIconProps) => {
  return (
    <ChevronDownIcon
      className={cn(
        'pointer-events-none absolute top-1/2 right-6 size-4 shrink-0 -translate-y-1/2',
        className
      )}
    />
  );
};

type SelectProps = React.ComponentPropsWithRef<typeof SelectPrimitives.Root> & {
  'aria-invalid'?: boolean;
};

const Select = ({
  children,
  'aria-invalid': ariaInvalid = false,
  ...props
}: SelectProps) => {
  return (
    <SelectContext value={{ invalid: !!ariaInvalid }}>
      <SelectPrimitives.Root {...props}>{children}</SelectPrimitives.Root>
    </SelectContext>
  );
};

type SelectTriggerProps = React.ComponentPropsWithRef<
  typeof SelectPrimitives.Trigger
> & {
  placeholder?: string;
};

const SelectTrigger = ({
  className,

  placeholder,
  ...props
}: SelectTriggerProps) => {
  const { invalid } = useSelectContext();

  return (
    <SelectPrimitives.Trigger
      className={cn(
        'border-gray-scale-gray-10 bg-gray-scale-white relative flex h-[56px] w-full items-center justify-between rounded-[4px] border pr-14 pl-6 text-start outline-hidden',
        'data-placeholder:text-gray-scale-gray-50',
        '[&>span]:min-w-0',
        'placeholder-text-gray-scale-gray-50',
        'cursor-pointer',
        'data-[state=open]:[&>svg]:rotate-180',
        'disabled:border-text-inactive disabled:bg-gray-scale-gray-1 disabled:text-text-inactive disabled:pointer-events-none',
        invalid && 'border-system-warning',
        className
      )}
      aria-invalid={invalid}
      {...props}
    >
      <span className="truncate">
        <SelectPrimitives.Value placeholder={placeholder} />
      </span>
      <SelectPrimitives.Icon
        className="transition-transform"
        asChild
      >
        <SelectChevronDownIcon />
      </SelectPrimitives.Icon>
    </SelectPrimitives.Trigger>
  );
};

type SelectContentProps = React.ComponentPropsWithRef<
  typeof SelectPrimitives.Content
>;

const SelectContent = ({
  className,
  children,
  position = 'popper',
  ...props
}: SelectContentProps) => {
  return (
    <SelectPrimitives.Portal>
      <SelectPrimitives.Content
        className={cn(
          'border-gray-scale-gray-10 text-main bg-gray-scale-white relative z-50 max-w-[calc(100vw-12px)] overflow-hidden rounded-[4px] border',
          'max-h-[var(--radix-select-content-available-height)]',
          position === 'popper' &&
            'w-full min-w-[var(--radix-select-trigger-width)]',
          className
        )}
        position={position}
        alignOffset={0}
        sideOffset={4}
        {...props}
      >
        <SelectPrimitives.Viewport
          className={cn(
            'divide-gray-scale-gray-10 divide-y',
            position === 'popper' && 'h-[var(--radix-select-trigger-height)]'
          )}
        >
          {children}
        </SelectPrimitives.Viewport>
      </SelectPrimitives.Content>
    </SelectPrimitives.Portal>
  );
};

type SelectOptionProps = React.ComponentPropsWithRef<
  typeof SelectPrimitives.Item
>;

const SelectOption = ({ className, children, ...props }: SelectOptionProps) => {
  return (
    <SelectPrimitives.Item
      className={cn(
        'relative flex h-[56px] w-full cursor-pointer items-center px-6 outline-hidden select-none',
        'focus:bg-gray-scale-gray-1',
        'data-[state=checked]:text-key-color-primary',
        'data-disabled:pointer-events-none',
        className
      )}
      {...props}
    >
      <SelectPrimitives.ItemText>{children}</SelectPrimitives.ItemText>
    </SelectPrimitives.Item>
  );
};

Select.Trigger = SelectTrigger;
Select.Content = SelectContent;
Select.Option = SelectOption;

export const ChevronDownIcon = ({ className }: { className: string }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
    >
      <g clipPath="url(#clip0_89_1012)">
        <path
          d="M14.772 6.27197L8.27197 12.772L1.77197 6.27197"
          stroke="#1A1A1A"
        />
      </g>
      <defs>
        <clipPath id="clip0_89_1012">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(0 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

type SelectContextValue = {
  invalid: boolean;
};

const [SelectContext, useSelectContext] =
  createContextFactory<SelectContextValue>('Select');

export { Select };
