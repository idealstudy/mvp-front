'use client';

import { ReactNode, useState } from 'react';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { MiniSpinner } from '@/shared/components/loading';
import { cn } from '@/shared/lib/utils';
import { useMemberStore } from '@/store';
import { SwitchCameraIcon } from 'lucide-react';

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
  isUploading?: boolean;
  onThumbnailDelete?: () => void;
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
  isUploading,
  onThumbnailDelete,
}: BaseHeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const teacherId = useMemberStore((s) => s.member?.id);
  const pathname = usePathname();
  const isPreviewPage = pathname.includes('study-room-preview');

  const handleImageClick = () => {
    if (isUploading) return;
    if (thumbnailUrl && onThumbnailDelete) {
      setShowMenu((prev) => !prev);
    } else {
      onThumbnailClick?.();
    }
  };

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
          onThumbnailClick && 'cursor-pointer',
          isUploading && 'cursor-not-allowed'
        )}
        onClick={handleImageClick}
      >
        {!isPreviewPage ? (
          <button
            type="button"
            className={cn(
              'border-gray-5 bg-gray-12/40 font-label-normal absolute top-2 right-2 z-10 flex h-8 w-20 cursor-pointer items-center justify-center gap-2 rounded-[8px] border pt-1 pr-2.5 pb-1 pl-1.5 text-white'
            )}
            onClick={(e) => {
              e.stopPropagation();
              onMoveToPreview();
            }}
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
          className="object-contain"
        />

        {/* 업로드 로딩 오버레이 */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <MiniSpinner />
          </div>
        )}

        {onThumbnailClick && (
          <div className="absolute right-2 bottom-2 z-1 flex h-12 w-12 items-center justify-center rounded-full bg-white/70">
            <SwitchCameraIcon
              size={24}
              className="text-gray-12"
            />
          </div>
        )}

        {/* 삭제/변경 메뉴 */}
        {showMenu && (
          <div
            className="absolute inset-0 flex cursor-default items-center justify-center gap-3 bg-black/50"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
            }}
          >
            <button
              type="button"
              className="font-label-heading text-system-warning cursor-pointer rounded-md bg-white/90 px-4 py-2"
              onClick={(e) => {
                e.stopPropagation();
                onThumbnailDelete?.();
                setShowMenu(false);
              }}
            >
              삭제
            </button>
            <button
              type="button"
              className="font-label-heading text-gray-11 cursor-pointer rounded-md bg-white/90 px-4 py-2 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onThumbnailClick?.();
                setShowMenu(false);
              }}
            >
              변경
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
