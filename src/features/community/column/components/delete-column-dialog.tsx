'use client';

import { Button } from '@/shared/components/ui/button';
import { Dialog } from '@/shared/components/ui/dialog';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteColumnDialog({
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <Dialog.Content className="max-w-[400px]">
        <Dialog.Header>
          <Dialog.Title>칼럼을 삭제하시겠습니까?</Dialog.Title>
          <Dialog.Description>
            삭제된 칼럼은 복구할 수 없습니다.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer className="mt-6 flex justify-end">
          <Button
            variant="outlined"
            size="small"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            size="small"
            variant="secondary"
            onClick={onConfirm}
          >
            삭제
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
