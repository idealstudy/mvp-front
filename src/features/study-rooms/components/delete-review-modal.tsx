'use client';

import { Button, Dialog } from '@/shared/components/ui';

import { useDeleteReview } from '../hooks/use-delete-review';

type DeleteReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reviewId: number;
};

export const DeleteReviewModal = ({
  isOpen,
  onClose,
  reviewId,
}: DeleteReviewModalProps) => {
  const { mutate, isPending } = useDeleteReview({ onSuccess: onClose });

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Content
        className="tablet:max-w-[420px] flex min-h-[220px] max-w-[300px] flex-col gap-6"
        onInteractOutside={(event) => {
          if (isPending) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          if (isPending) event.preventDefault();
        }}
      >
        <Dialog.Header>
          <Dialog.Title>후기를 삭제하시겠어요?</Dialog.Title>
          <Dialog.Description>
            삭제한 후기는 복구할 수 없어요.
          </Dialog.Description>
        </Dialog.Header>

        <Dialog.Footer className="mt-auto justify-end">
          <Button
            variant="outlined"
            size="small"
            onClick={onClose}
            disabled={isPending}
          >
            취소
          </Button>
          <Button
            size="small"
            onClick={() => mutate(reviewId)}
            disabled={isPending}
          >
            {isPending ? '삭제 중...' : '삭제'}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
