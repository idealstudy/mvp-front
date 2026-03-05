import Link from 'next/link';

import { Dialog } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/button';
import { PUBLIC } from '@/shared/constants';
import { XIcon } from 'lucide-react';

type InviteLoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  inviteToken: string;
};

export const InviteLoginModal = ({
  isOpen,
  onClose,
  inviteToken,
}: InviteLoginModalProps) => {
  return (
    <Dialog isOpen={isOpen}>
      <Dialog.Content className="tablet:w-125 tablet:p-9 w-[285px] gap-6 p-5">
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
          <div className="tablet:gap-4 flex w-full flex-col gap-1">
            <Dialog.Title className="font-body2-heading tablet:font-headline1-heading text-gray-12 text-center">
              디에듀에 로그인하시겠습니까?
            </Dialog.Title>
            <p className="font-label-normal tablet:font-headline2-normal text-gray-10 text-center">
              스터디룸에 참여하려면 로그인이 필요해요.
            </p>
          </div>
        </Dialog.Header>
        <Dialog.Body className="tablet:px-6">
          <Link
            href={`${PUBLIC.CORE.LOGIN}?token=${encodeURIComponent(inviteToken)}`}
          >
            <Button
              size="small"
              className="w-full rounded-sm"
            >
              로그인하기
            </Button>
          </Link>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  );
};
