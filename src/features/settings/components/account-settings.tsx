'use client';

import { useState } from 'react';

import WithdrawDialog from '@/features/settings/components/withdraw-dialog';
import { Button } from '@/shared/components/ui';

export default function AccountSettings() {
  const [isOpen, setIsOpen] = useState(false);

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
              onClick={() => setIsOpen(true)}
            >
              탈퇴하기
            </Button>
          </div>
        </div>
      </div>

      {/* 탈퇴 확인 Dialog */}
      <WithdrawDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
