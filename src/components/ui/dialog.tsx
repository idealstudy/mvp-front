'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { Dialog as DialogPrimitives } from 'radix-ui';

type DialogProps = Omit<DialogPrimitives.DialogProps, 'open'> & {
  isOpen?: boolean;
};

const Dialog = ({ children, isOpen, ...props }: DialogProps) => {
  return (
    <DialogPrimitives.Root
      open={isOpen}
      {...props}
    >
      {children}
    </DialogPrimitives.Root>
  );
};

type DialogOverlayProps = React.ComponentPropsWithRef<
  typeof DialogPrimitives.Overlay
>;

const DialogOverlay = ({
  className,
  children,
  ...props
}: DialogOverlayProps) => {
  return (
    <DialogPrimitives.Overlay
      className={cn('fixed inset-0 z-50 bg-black/30', className)}
      {...props}
    >
      {children}
    </DialogPrimitives.Overlay>
  );
};

type DialogContentProps = React.ComponentPropsWithRef<
  typeof DialogPrimitives.Content
>;

const DialogContent = ({
  className,
  children,
  ...props
}: DialogContentProps) => {
  return (
    <DialogPrimitives.Portal>
      <DialogOverlay />
      <DialogPrimitives.Content
        aria-modal
        className={cn(
          'bg-system-background-alt border-line-line1 fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100%-4rem)] w-full max-w-[calc(100%-4rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-[16px] border p-9',
          className
        )}
        {...props}
      >
        {children}
        <DialogClose />
      </DialogPrimitives.Content>
    </DialogPrimitives.Portal>
  );
};

type DialogHeaderProps = React.ComponentPropsWithRef<'div'>;

const DialogHeader = ({ className, children, ...props }: DialogHeaderProps) => {
  return (
    <div
      className={cn('flex flex-col gap-1.5', className)}
      {...props}
    >
      {children}
    </div>
  );
};

type DialogBodyProps = React.ComponentPropsWithRef<'div'>;

const DialogBody = ({ className, children, ...props }: DialogBodyProps) => {
  return (
    <div
      className={cn('flex flex-1 flex-col overflow-y-auto', className)}
      {...props}
    >
      {children}
    </div>
  );
};

type DialogFooterProps = React.ComponentPropsWithRef<'div'>;

const DialogFooter = ({ className, children, ...props }: DialogFooterProps) => {
  return (
    <div
      className={cn('flex gap-[10px]', className)}
      {...props}
    >
      {children}
    </div>
  );
};

type DialogTitleProps = React.ComponentPropsWithRef<
  typeof DialogPrimitives.Title
>;

const DialogTitle = ({ className, children, ...props }: DialogTitleProps) => {
  return (
    <DialogPrimitives.Title
      className={cn('font-headline1-heading', className)}
      {...props}
    >
      {children}
    </DialogPrimitives.Title>
  );
};

type DialogDescriptionProps = React.ComponentPropsWithRef<
  typeof DialogPrimitives.Description
>;

const DialogDescription = ({
  className,
  children,
  ...props
}: DialogDescriptionProps) => {
  return (
    <DialogPrimitives.Description
      className={cn('', className)}
      {...props}
    >
      {children}
    </DialogPrimitives.Description>
  );
};

type DialogTriggerProps = React.ComponentPropsWithRef<
  typeof DialogPrimitives.Trigger
>;

const DialogTrigger = ({ children, ...props }: DialogTriggerProps) => {
  return (
    <DialogPrimitives.Trigger
      aria-controls={undefined}
      {...props}
    >
      {children}
    </DialogPrimitives.Trigger>
  );
};

const DialogClose = () => {
  return (
    <DialogPrimitives.Close
      className="absolute top-9 right-9 flex size-[24px] cursor-pointer items-center justify-center"
      aria-label="닫기"
    >
      <XIcon />
    </DialogPrimitives.Close>
  );
};

Dialog.Trigger = DialogTrigger;
Dialog.Close = DialogPrimitives.Close;
Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
Dialog.Body = DialogBody;
Dialog.Footer = DialogFooter;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;

export { Dialog };

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
