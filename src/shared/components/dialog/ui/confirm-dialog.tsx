'use client';

import React from 'react';

import { DialogAction } from '@/shared/components/dialog';
import { Button } from '@/shared/components/ui/button';
import { Dialog } from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib';

// TODO: 스터디룸/공용 내 다이얼로그 컴포넌트를 공용컴포넌트로 분리해볼 예정
type ConfirmDialogVariant = 'ok' | 'confirm' | 'confirm-cancel' | 'delete';
export const ConfirmDialog = ({
  open,
  dispatch,
  variant = 'confirm',
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  pending = false,
  emphasis = 'desc-strong',
}: {
  open: boolean;
  dispatch: (action: DialogAction) => void;
  variant?: ConfirmDialogVariant;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  pending?: boolean;
  emphasis?: 'title-strong' | 'desc-strong' | 'none';
}) => {
  const isTwoButtons = variant === 'delete' || variant === 'confirm-cancel';
  const _confirmText =
    confirmText ??
    (variant === 'delete' ? '삭제' : variant === 'ok' ? '확인' : '확인');
  const _cancelText = cancelText ?? (variant === 'delete' ? '취소' : '취소');

  const close = () => dispatch({ type: 'CLOSE' });

  return (
    <Dialog
      isOpen={open}
      onOpenChange={close}
    >
      <Dialog.Content className="w-[598px]">
        <Dialog.Header>
          {title ? (
            <Dialog.Title
              className={cn(
                'text-center',
                emphasis === 'title-strong' && 'font-headline1-heading'
              )}
            >
              {title}
            </Dialog.Title>
          ) : (
            <Dialog.Title className="text-center" />
          )}
        </Dialog.Header>

        <Dialog.Body className="mt-6">
          {description && (
            <Dialog.Description
              className={cn(
                'text-center',
                emphasis === 'desc-strong' &&
                  'font-headline1-heading font-bold',
                'font-headline2-normal mt-2'
              )}
            >
              {description}
            </Dialog.Description>
          )}
        </Dialog.Body>

        <Dialog.Footer className="mt-6 justify-center gap-8">
          {isTwoButtons && (
            <Button
              className="w-[120px]"
              size="xsmall"
              variant="outlined"
              onClick={() => {
                onCancel?.();
                close();
              }}
              disabled={pending}
            >
              {_cancelText}
            </Button>
          )}
          <Button
            className="w-[120px]"
            size="xsmall"
            variant={variant === 'delete' ? 'secondary' : 'secondary'}
            onClick={() => {
              onConfirm?.();
            }}
            disabled={pending}
          >
            {_confirmText}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
