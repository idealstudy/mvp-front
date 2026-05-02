import { ExclamationIcon } from '@/shared/components/icons';
import { Dialog } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/button';
import { XIcon } from 'lucide-react';

type InviteExitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const InviteExitModal = ({
  isOpen,
  onClose,
  onConfirm,
}: InviteExitModalProps) => {
  return (
    <Dialog isOpen={isOpen}>
      <Dialog.Content
        data-testid="invite-exit-modal"
        className="tablet:w-125 tablet:p-9 w-[285px] gap-6 p-5"
      >
        <Dialog.Header className="flex-col items-end gap-2">
          <button
            type="button"
            className="flex cursor-pointer items-center justify-center"
            onClick={onClose}
          >
            <XIcon
              strokeWidth={1}
              size={24}
              className="tablet:size-8"
            />
          </button>
          <div className="tablet:gap-4 flex w-full flex-col items-center gap-2">
            <div className="bg-orange-2 flex size-10 items-center justify-center rounded-full">
              <ExclamationIcon className="text-orange-6" />
            </div>
            <Dialog.Title className="font-body2-heading tablet:font-headline1-heading text-gray-12 text-center">
              스터디룸 초대를 거절하시겠어요?
            </Dialog.Title>
            <p className="font-label-normal tablet:font-headline2-normal text-gray-10 text-center">
              초대를 거절하면 <br className="tablet:hidden" />
              스터디룸에 참여할 수 없어요.
            </p>
          </div>
        </Dialog.Header>
        <Dialog.Body className="tablet:px-6">
          <div className="flex gap-3">
            <Button
              data-testid="invite-exit-modal-cancel-button"
              variant="outlined"
              size="small"
              className="w-full rounded-lg"
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              data-testid="invite-exit-modal-confirm-button"
              size="small"
              className="w-full rounded-lg"
              onClick={onConfirm}
            >
              확인
            </Button>
          </div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  );
};
