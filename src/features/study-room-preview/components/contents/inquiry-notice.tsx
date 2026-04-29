'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Input } from '@/shared/components/ui';
import { cn } from '@/shared/lib';
import { Check, PenLineIcon } from 'lucide-react';

export default function InquiryNotice({ isOwner }: { isOwner: boolean }) {
  const [isEditMode, setIsEditMode] = useState(false);

  // 편집 버튼
  const actionButton = isEditMode ? (
    <button
      className={cn(
        'flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm border',
        false
          ? 'bg-orange-7 border-gray-12 text-white'
          : 'bg-gray-1 text-gray-3 border-gray-5'
      )}
      onClick={() => setIsEditMode(false)}
      aria-label="편집 완료"
    >
      <Check size={20} />
    </button>
  ) : (
    <button
      onClick={() => setIsEditMode(true)}
      className="cursor-pointer"
      aria-label="편집하기"
    >
      <PenLineIcon
        size={16}
        color="var(--color-gray-7)"
      />
    </button>
  );

  return (
    <div className="bg-gray-1 mb-3 flex w-full items-start gap-2 rounded-xl p-4 pl-3">
      <Image
        src="/ic_media.svg"
        alt=""
        width={15}
        height={15}
        className="m-1"
      />
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <p className="text-gray-9 font-body2-heading">상담 시 공지</p>
          {isOwner && actionButton}
        </div>
        {isEditMode ? (
          <Input className="rounded-lg bg-white" />
        ) : (
          <p className="text-gray-7">
            상담 시 참고하면 좋을 내용을 작성해보세요
          </p>
        )}
      </div>
    </div>
  );
}
