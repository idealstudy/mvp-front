'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { TextField } from '@/components/ui/text-field';

export const InviteButton = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  return (
    <>
      {isInviteOpen && (
        <Dialog
          isOpen={isInviteOpen}
          onOpenChange={setIsInviteOpen}
        >
          <Dialog.Content className="w-[598px]">
            <Dialog.Header>
              <Dialog.Title>학생 초대</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body className="mt-6">
              <TextField>
                <TextField.Input placeholder="초대할 학생의 이메일을 입력해주세요." />
              </TextField>
            </Dialog.Body>
            <Dialog.Footer className="mt-6 justify-end">
              <Dialog.Close asChild>
                <Button
                  className="w-[120px]"
                  size="small"
                >
                  초대하기
                </Button>
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      )}
      <Button
        className="bg-orange-scale-orange-1 border-key-color-primary hover:bg-orange-scale-orange-10 flex w-full items-center justify-center gap-1 rounded-[8px]"
        onClick={() => setIsInviteOpen(true)}
      >
        <Image
          src="/studyroom/ic-invite.png"
          alt="invite-student"
          width={24}
          height={24}
          className="mb-1"
        />
        <span className="font-body2-normal text-key-color-primary">
          학생 초대
        </span>
      </Button>
    </>
  );
};
