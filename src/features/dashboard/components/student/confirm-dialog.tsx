'use client';

import { type ConnectListItemDTO, connectionKeys } from '@/entities/connect';
import { Button } from '@/shared/components/ui';
import { Dialog } from '@/shared/components/ui/dialog';
import { classifyConnectionError, handleApiError } from '@/shared/lib/errors';
import { useQueryClient } from '@tanstack/react-query';
import { XIcon } from 'lucide-react';

import {
  useAcceptConnection,
  useRejectConnection,
} from '../../connect/hooks/use-connection';

interface ConfirmParentRequestDialogProps {
  connection: ConnectListItemDTO | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export const ConfirmParentRequestDialog = ({
  connection,
  onOpenChange,
  open,
}: ConfirmParentRequestDialogProps) => {
  const { mutate: acceptConnection, isPending: isAccepting } =
    useAcceptConnection();
  const { mutate: rejectConnection, isPending: isRejecting } =
    useRejectConnection();
  const queryClient = useQueryClient();

  const isPending = isAccepting || isRejecting;

  const handleConnectionError = (error: unknown) => {
    handleApiError(error, classifyConnectionError, {
      // INVALID_CONNECTION_STATE, CONNECTION_NOT_FOUND
      onContext: () => {
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: connectionKeys.all });
      },
    });
  };

  const handleAccept = () => {
    if (!connection) return;

    acceptConnection(connection.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
      onError: handleConnectionError,
    });
  };

  const handleReject = () => {
    if (!connection) return;

    rejectConnection(connection.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
      onError: handleConnectionError,
    });
  };

  return (
    <Dialog
      isOpen={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Content className="w-[480px]">
        <Dialog.Header className="flex-row items-center justify-between">
          <Dialog.Title>보호자 연결 요청</Dialog.Title>
          <Dialog.Close
            asChild
            aria-label="닫기"
          >
            <button
              type="button"
              className="flex size-6 cursor-pointer items-center justify-center"
            >
              <XIcon size={24} />
            </button>
          </Dialog.Close>
        </Dialog.Header>
        <Dialog.Body className="mt-5 gap-2">
          <Dialog.Description className="font-body2-normal text-text-sub1">
            {connection?.opponent.name ?? connection?.opponent.email}님이 보호자
            연결을 요청했습니다.
          </Dialog.Description>
          <p className="font-label-normal text-text-sub2">
            수락하면 보호자가 학습 현황과 선생님 피드백을 확인할 수 있습니다.
          </p>
        </Dialog.Body>
        <Dialog.Footer className="mt-6 justify-end">
          <Button
            variant="outlined"
            size="xsmall"
            className="w-[96px]"
            disabled={isPending}
            onClick={handleReject}
          >
            거절
          </Button>
          <Button
            size="xsmall"
            className="w-[96px]"
            disabled={isPending}
            onClick={handleAccept}
          >
            수락
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
