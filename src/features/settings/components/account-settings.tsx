'use client';

import { Button } from '@/shared/components/ui';

export default function AccountSettings() {
  return (
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
          >
            탈퇴하기
          </Button>
        </div>
      </div>
    </div>
  );
}
