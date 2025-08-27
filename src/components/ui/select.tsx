'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { Select as SelectPrimitives } from 'radix-ui';

type SelectProps = React.ComponentPropsWithRef<typeof SelectPrimitives.Root>;

const Select = ({ children, ...props }: SelectProps) => {
  return <SelectPrimitives.Root {...props}>{children}</SelectPrimitives.Root>;
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
  return (
    <SelectPrimitives.Trigger
      className={cn(
        'border-line-line3 bg-gray-scale-white relative flex h-[36px] items-center justify-between rounded-[8px] border pr-11 pl-3 text-start text-sm outline-hidden',
        'min-w-[110px]',
        'data-placeholder:text-text-sub2',
        '[&>span]:min-w-0',
        'placeholder-text-text-sub2',
        'cursor-pointer',
        'data-[state=open]:[&>svg]:rotate-180',
        className
      )}
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
          'border-line-line2 text-main bg-gray-scale-white relative z-50 max-w-[calc(100vw-12px)] overflow-hidden rounded-[6px] border',
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
        'relative flex h-[32px] cursor-pointer items-center justify-center px-3 outline-hidden select-none',
        'focus:bg-gray-scale-gray-5',
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
      stroke="currentColor"
    >
      <g clipPath="url(#clip0_89_1012)">
        <path d="M14.772 6.27197L8.27197 12.772L1.77197 6.27197" />
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

type SelectChevronDownIconProps = {
  className?: string;
};

export const SelectChevronDownIcon = ({
  className,
}: SelectChevronDownIconProps) => {
  return (
    <ChevronDownIcon
      className={cn(
        'text-line-line2 pointer-events-none absolute top-1/2 right-3 size-4 shrink-0 -translate-y-1/2',
        className
      )}
    />
  );
};

export { Select };
