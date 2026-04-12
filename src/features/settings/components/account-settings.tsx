'use client';

import { useState } from 'react';

import { useWithdraw } from '@/features/settings/hooks/use-withdraw';
import { Button, Dialog } from '@/shared/components/ui';

export default function AccountSettings() {
  const [open, setOpen] = useState(false);
  const { mutate: withdraw, isPending } = useWithdraw();

  return (
    <>
      <div className="flex flex-col gap-6">
        <h2 className="font-body1-heading">계정</h2>

        {/* 계정 탈퇴 */}
        <div className="border-line-line1 rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body1-heading">계정 탈퇴</p>
              <p className="font-caption-normal text-system-warning mt-2">
                탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
              </p>
            </div>
            <Button
              variant="secondary"
              size="xsmall"
              onClick={() => setOpen(true)}
            >
              탈퇴하기
            </Button>
          </div>
        </div>
      </div>

      {/* 탈퇴 확인 Dialog */}
      <Dialog
        isOpen={open}
        onOpenChange={isPending ? undefined : setOpen}
      >
        <Dialog.Content className="w-[400px]">
          <Dialog.Header>
            <Dialog.Title className="text-center">
              정말 탈퇴하시겠어요?
            </Dialog.Title>
          </Dialog.Header>
          <Dialog.Body className="mt-4">
            <Dialog.Description className="text-center">
              탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
            </Dialog.Description>
          </Dialog.Body>
          <Dialog.Footer className="mt-6 justify-center gap-4">
            <Button
              variant="outlined"
              size="xsmall"
              className="w-[120px]"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              취소
            </Button>
            <Button
              variant="secondary"
              size="xsmall"
              className="w-[120px]"
              onClick={() => withdraw()}
              disabled={isPending}
            >
              탈퇴하기
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
