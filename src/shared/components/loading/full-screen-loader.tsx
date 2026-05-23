import React from 'react';

export const FullScreenLoader = ({ title }: { title: string }) => (
  <div
    role="status"
    aria-busy="true"
    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
  >
    <div className="relative flex h-[96px] w-[96px] items-center justify-center">
      <div className="border-orange-7/20 border-t-orange-7 absolute inset-0 animate-spin rounded-full border-2" />
      <div
        className="border-orange-7/30 border-b-orange-7 absolute inset-2 animate-spin rounded-full border"
        style={{ animationDirection: 'reverse', animationDuration: '1.4s' }}
      />
    </div>

    <div className="z-[9999] mt-8 flex flex-col items-center gap-[12px]">
      <p className="text-key-color-quaternary text-[20px] font-semibold">
        {title}
      </p>
      <p className="text-text-sub1 text-center text-[14px]">
        한 수업의 모든 순간을 한 공간에서 완성하세요
      </p>
    </div>
  </div>
);
