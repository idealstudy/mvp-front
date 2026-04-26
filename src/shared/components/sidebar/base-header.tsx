'use client';

import { ReactNode } from 'react';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { cn } from '@/shared/lib/utils';
import { useMemberStore } from '@/store';

type BaseHeaderProps = {
  studyRoomId?: number;
  studyRoomName?: string;
  teacherName?: string;
  teacherSuffix?: string;
  fallbackStudyRoomName: string;
  titleClassName?: string;
  teacherClassName?: string;
  wrapperClassName?: string;
  imageWrapperClassName?: string;
  rightSlot?: ReactNode;
  thumbnailUrl?: string | null;
  onThumbnailClick?: () => void;
};

export const BaseHeader = ({
  studyRoomId,
  studyRoomName,
  teacherName,
  teacherSuffix = '',
  fallbackStudyRoomName,
  titleClassName = 'truncate text-[20px] leading-tight font-bold',
  teacherClassName = 'text-sm text-gray-scale-gray-60',
  wrapperClassName = 'flex flex-col gap-6',
  imageWrapperClassName = 'bg-orange-scale-orange-1 relative h-[200px] w-full overflow-hidden rounded-[12px]',
  rightSlot,
  thumbnailUrl,
  onThumbnailClick,
}: BaseHeaderProps) => {
  const router = useRouter();
  const teacherId = useMemberStore((s) => s.member?.id);
  const pathname = usePathname();
  const isPreviewPage = pathname.includes('study-room-preview');

  const onMoveToPreview = () => {
    router.push(`/study-room-preview/${studyRoomId}/${teacherId}`);
  };

  return (
    <div className={wrapperClassName}>
      <div className="flex flex-col gap-1">
        <div className="flex h-12 items-center justify-between">
          <p className={titleClassName}>
            {studyRoomName || fallbackStudyRoomName}
          </p>
          {rightSlot}
        </div>
        {teacherName && (
          <p className={teacherClassName}>
            {teacherName}
            {teacherSuffix ? ` ${teacherSuffix}` : ''}
          </p>
        )}
      </div>
      <div
        className={cn(
          imageWrapperClassName,
          onThumbnailClick && 'cursor-pointer'
        )}
        onClick={onThumbnailClick}
      >
        {!isPreviewPage ? (
          <button
            type="button"
            className={cn(
              'border-gray-5 bg-gray-12/40 font-label-normal absolute top-2 right-2 z-10 flex h-8 w-20 cursor-pointer items-center justify-center gap-2 rounded-[8px] border pt-1 pr-2.5 pb-1 pl-1.5 text-white'
            )}
            onClick={onMoveToPreview}
          >
            <Image
              src="/studyroom/ic-direct.png"
              alt="direct-preview"
              width={14}
              height={14}
            />
            프리뷰
          </button>
        ) : null}

        <Image
          src={thumbnailUrl || '/studyroom/profile.svg'}
          alt="study-room-profile"
          fill
          className={thumbnailUrl ? 'object-cover' : 'object-contain'}
        />
      </div>
    </div>
  );
};
