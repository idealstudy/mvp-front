'use client';

import { ExclamationIcon } from '@/shared/components/icons';
import { Button, Dialog } from '@/shared/components/ui';
import { X } from 'lucide-react';

interface StudyRoomClassLinksDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const StudyroomClassLinksDeleteDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: StudyRoomClassLinksDeleteDialogProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onClose}
    >
      <Dialog.Content className="tablet:max-w-[520px] max-w-[300px] gap-6">
        <div className="flex justify-end">
          <Dialog.Close
            className="text-gray-9 hover:text-gray-12 flex h-6 w-6 cursor-pointer items-center justify-center"
            aria-label="닫기"
          >
            <X size={34} />
          </Dialog.Close>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="bg-system-warning/10 flex h-10 w-10 items-center justify-center rounded-full">
            <ExclamationIcon className="text-system-warning" />
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Dialog.Title className="font-body1-heading tablet:font-headline1-heading">
              수업 링크를 삭제하시겠습니까?
            </Dialog.Title>
            <Dialog.Description className="text-gray-7 font-body2-normal tablet:font-headline2-normal">
              삭제하면 학생들에게 더 이상 링크가 노출되지 않습니다.
            </Dialog.Description>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outlined"
            size="small"
            className="tablet:h-[64px] tablet:font-headline2-heading flex-1"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="small"
            className="tablet:h-[64px] tablet:font-headline2-heading flex-1"
            onClick={onConfirm}
          >
            확인
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
