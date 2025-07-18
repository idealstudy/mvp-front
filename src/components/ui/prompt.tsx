'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertDialog as AlertDialogPrimitives } from 'radix-ui';

type PromptProps = Omit<AlertDialogPrimitives.AlertDialogProps, 'open'> & {
  isOpen?: boolean;
};

const Prompt = ({ children, isOpen, ...props }: PromptProps) => {
  return (
    <AlertDialogPrimitives.Root
      open={isOpen}
      {...props}
    >
      {children}
    </AlertDialogPrimitives.Root>
  );
};

type PromptOverlayProps = React.ComponentPropsWithRef<
  typeof AlertDialogPrimitives.Overlay
>;

const PromptOverlay = ({
  className,
  children,
  ...props
}: PromptOverlayProps) => {
  return (
    <AlertDialogPrimitives.Overlay
      className={cn('fixed inset-0 z-50 bg-black/70', className)}
      {...props}
    >
      {children}
    </AlertDialogPrimitives.Overlay>
  );
};

type PromptContentProps = React.ComponentPropsWithRef<
  typeof AlertDialogPrimitives.Content
>;

const PromptContent = ({
  className,
  children,
  ...props
}: PromptContentProps) => {
  return (
    <AlertDialogPrimitives.Portal>
      <PromptOverlay />
      <AlertDialogPrimitives.Content
        aria-modal
        className={cn(
          'bg-system-background-alt fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100%-4rem)] w-[400px] max-w-[calc(100%-4rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto p-5',
          className
        )}
        {...props}
      >
        {children}
        <PromptClose />
      </AlertDialogPrimitives.Content>
    </AlertDialogPrimitives.Portal>
  );
};

type PromptHeaderProps = React.ComponentPropsWithRef<'div'>;

const PromptHeader = ({ className, children, ...props }: PromptHeaderProps) => {
  return (
    <div
      className={cn('my-[25px] flex flex-col gap-1.5', className)}
      {...props}
    >
      {children}
    </div>
  );
};

type PromptFooterProps = React.ComponentPropsWithRef<'div'>;

const PromptFooter = ({ className, children, ...props }: PromptFooterProps) => {
  return (
    <div
      className={cn('flex gap-[10px] pt-[10px]', className)}
      {...props}
    >
      {children}
    </div>
  );
};

type PromptTitleProps = React.ComponentPropsWithRef<
  typeof AlertDialogPrimitives.Title
>;

const PromptTitle = ({ className, children, ...props }: PromptTitleProps) => {
  return (
    <AlertDialogPrimitives.Title
      className={cn('text-center text-[20px]', className)}
      {...props}
    >
      {children}
    </AlertDialogPrimitives.Title>
  );
};

type PromptDescriptionProps = React.ComponentPropsWithRef<
  typeof AlertDialogPrimitives.Description
>;

const PromptDescription = ({
  className,
  children,
  ...props
}: PromptDescriptionProps) => {
  return (
    <AlertDialogPrimitives.Description
      className={cn('', className)}
      {...props}
    >
      {children}
    </AlertDialogPrimitives.Description>
  );
};

type PromptTriggerProps = React.ComponentPropsWithRef<
  typeof AlertDialogPrimitives.Trigger
>;

const PromptTrigger = ({ children, ...props }: PromptTriggerProps) => {
  return (
    <AlertDialogPrimitives.Trigger
      aria-controls={undefined}
      {...props}
    >
      {children}
    </AlertDialogPrimitives.Trigger>
  );
};

const PromptClose = () => {
  return (
    <AlertDialogPrimitives.Cancel
      className="absolute top-[27px] right-[18px] flex size-[24px] cursor-pointer items-center justify-center"
      aria-label="닫기"
    >
      <XIcon />
    </AlertDialogPrimitives.Cancel>
  );
};

type PromptCancelProps = React.ComponentPropsWithRef<typeof Button>;

const PromptCancel = ({ className, children, ...props }: PromptCancelProps) => {
  return (
    <AlertDialogPrimitives.Cancel asChild>
      <Button
        className={cn('w-full', className)}
        size="large"
        variant="secondary"
        {...props}
      >
        {children}
      </Button>
    </AlertDialogPrimitives.Cancel>
  );
};

type PromptActionProps = React.ComponentPropsWithRef<typeof Button>;

const PromptAction = ({ className, children, ...props }: PromptActionProps) => {
  return (
    <AlertDialogPrimitives.Action asChild>
      <Button
        className={cn('w-full', className)}
        size="large"
        {...props}
      >
        {children}
      </Button>
    </AlertDialogPrimitives.Action>
  );
};

Prompt.Trigger = PromptTrigger;
Prompt.Close = AlertDialogPrimitives.Cancel;
Prompt.Content = PromptContent;
Prompt.Header = PromptHeader;
Prompt.Footer = PromptFooter;
Prompt.Title = PromptTitle;
Prompt.Description = PromptDescription;
Prompt.Action = PromptAction;
Prompt.Cancel = PromptCancel;

export { Prompt };

const XIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
    >
      <path
        d="M1 16L8.5 8.5L16 16M16 1L8.49857 8.5L1 1"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
