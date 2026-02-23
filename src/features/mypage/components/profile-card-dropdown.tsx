'use client';

import { Dispatch, SetStateAction, useState } from 'react';

import Image from 'next/image';

import { Button, Dialog, DropdownMenu } from '@/shared/components/ui';

type Props = {
  profileId: string;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
};

export function ProfileCardDropdown({ profileId, setIsEditMode }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const copyProfileLink = (userId: string) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/profile/${userId}`
    );
    setIsShareDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu
        open={isOpen}
        onOpenChange={() => setIsOpen((prev) => !prev)}
      >
        <DropdownMenu.Trigger>
          <Image
            src="/studynotes/gray-kebab.svg"
            width={24}
            height={24}
            alt="dropdown-icon"
            className="cursor-pointer"
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-[110px] justify-center">
          <DropdownMenu.Item
            onClick={() => copyProfileLink(profileId)}
            className="justify-center"
          >
            <p>공유하기</p>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => setIsEditMode(true)}
            className="justify-center"
          >
            수정하기
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>

      {/* 공유하기 다이얼로그 */}
      <Dialog
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
      >
        <Dialog.Content className="max-w-120">
          <Dialog.Body className="mb-8 text-center">
            <Dialog.Title>링크가 복사되었습니다.</Dialog.Title>
          </Dialog.Body>
          <Dialog.Footer className="flex justify-center">
            <Dialog.Close asChild>
              <Button
                size="xsmall"
                className="w-30"
              >
                확인
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
