'use client';

import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { DropdownMenu as DropdownMenuPrimitives } from 'radix-ui';

type DropdownMenuProps = DropdownMenuPrimitives.DropdownMenuProps;

const DropdownMenu = ({ children, ...props }: DropdownMenuProps) => {
  return (
    <DropdownMenuPrimitives.Root {...props}>
      {children}
    </DropdownMenuPrimitives.Root>
  );
};

type DropdownMenuContentProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitives.Content
>;

const DropdownMenuContent = ({
  className,
  sideOffset = 4,
  children,
  ...props
}: DropdownMenuContentProps) => {
  return (
    <DropdownMenuPrimitives.Portal>
      <DropdownMenuPrimitives.Content
        className={cn(
          'border-line-line1 bg-gray-scale-white text-text-main z-50 overflow-hidden rounded-[6px] border',
          'animate-in fade-in-0',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        sideOffset={sideOffset}
        {...props}
      >
        {children}
      </DropdownMenuPrimitives.Content>
    </DropdownMenuPrimitives.Portal>
  );
};

const dropdownMenuItemVariants = cva(
  cn(
    'outline-hidden relative flex cursor-pointer select-none items-center px-4 h-[32px]',
    'focus:bg-background-gray',
    '[&_svg]:shrink-0'
  ),
  {
    variants: {
      variant: {
        default: 'text-text-main',
        danger: 'text-system-warning',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type DropdownMenuItemProps = React.ComponentPropsWithRef<
  typeof DropdownMenuPrimitives.Item
> &
  VariantProps<typeof dropdownMenuItemVariants>;

const DropdownMenuItem = ({
  className,
  children,
  variant,
  ...props
}: DropdownMenuItemProps) => {
  return (
    <DropdownMenuPrimitives.Item
      className={cn(dropdownMenuItemVariants({ variant }), className)}
      {...props}
    >
      {children}
    </DropdownMenuPrimitives.Item>
  );
};

DropdownMenu.Trigger = DropdownMenuPrimitives.Trigger;
DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Item = DropdownMenuItem;

export { DropdownMenu };
