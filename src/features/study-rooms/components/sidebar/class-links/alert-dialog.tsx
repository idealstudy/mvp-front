'use client';

import { ExclamationIcon } from '@/shared/components/icons';
import { Button, Dialog } from '@/shared/components/ui';
import { X } from 'lucide-react';

interface StudyRoomClassLinksAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudyroomClassLinksAlertDialog = ({
  isOpen,
  onClose,
}: StudyRoomClassLinksAlertDialogProps) => {
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
              수업 링크는 최대 5개까지 추가할 수 있어요
            </Dialog.Title>
            <Dialog.Description className="text-gray-7 font-body2-normal tablet:font-headline2-normal">
              기존의 링크를 삭제하거나 수정해보세요.
            </Dialog.Description>
          </div>
        </div>

        <Button
          variant="primary"
          size="small"
          className="tablet:h-[64px] tablet:font-headline2-heading w-full"
          onClick={onClose}
        >
          확인
        </Button>
      </Dialog.Content>
    </Dialog>
  );
};
