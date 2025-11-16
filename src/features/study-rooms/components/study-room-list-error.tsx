import React from 'react';

import { Button, Icon } from '@/shared/components/ui';

interface StudyRoomListErrorProps {
  onRetry: () => void;
}

export const StudyRoomListError = ({ onRetry }: StudyRoomListErrorProps) => {
  return (
    <div className="border-line-line1 bg-system-warning-alt flex flex-col items-center justify-center gap-4 rounded-[24px] border py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
        <Icon.QuestionMark className="text-system-warning h-6 w-6" />
      </div>
      <div>
        <p className="text-text-main text-lg font-semibold">
          스터디룸을 불러오지 못했어요
        </p>
        <p className="text-text-sub2 mt-1 text-sm">
          네트워크 상태를 확인한 뒤 다시 시도해주세요.
        </p>
      </div>
      <Button
        variant="secondary"
        size="small"
        onClick={onRetry}
      >
        다시 시도
      </Button>
    </div>
  );
};
