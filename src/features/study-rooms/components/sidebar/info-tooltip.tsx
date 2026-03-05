'use client';

import { X } from 'lucide-react';

type InfoTooltipToastProps = {
  toggleEnabled: boolean;
  isOpen: boolean;
  onClose: () => void;
};

export const InfoTooltipToast = ({
  toggleEnabled,
  isOpen,
  onClose,
}: InfoTooltipToastProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-[calc(50%-42px)] z-[100] mt-5 flex flex-col">
      {/* 삼각형 - 박스 왼쪽에서 32px, 상단에 밀착 (너비 20px, 높이 17px) */}
      <div className="border-b-gray-12 absolute -top-[17px] left-8 h-0 w-0 border-t-0 border-r-[10px] border-b-[17px] border-l-[10px] border-transparent" />
      <div className="bg-gray-12 relative flex items-start justify-between gap-1 rounded-lg px-3 py-2">
        <p className="font-caption-normal text-gray-white tablet:w-max w-35">
          링크가 {!toggleEnabled && '비'}활성화된 상태예요.
          <br />
          {toggleEnabled
            ? '이 링크를 통해 학생들이 직접 참여할 수 있어요.'
            : '다시 켜면 언제든 학생들이 참여할 수 있어요.'}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-white hover:opacity-80"
          aria-label="닫기"
        >
          <X
            className="h-4 w-4"
            strokeWidth={2}
          />
        </button>
      </div>
    </div>
  );
};
