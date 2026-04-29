'use client';

import { Dispatch } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { DialogAction } from '@/shared/components/dialog';
import { BaseHeader } from '@/shared/components/sidebar';
import { DropdownMenu } from '@/shared/components/ui/dropdown-menu';
import { PRIVATE } from '@/shared/constants';
import { cn } from '@/shared/lib';

export const StudyroomSidebarHeader = ({
  dispatch,
  studyRoomId,
  studyRoomName,
  teacherName,
  canManage,
  thumbnailUrl,
  onThumbnailClick,
  onThumbnailDelete,
  isUploading,
}: {
  dispatch: Dispatch<DialogAction>;
  studyRoomId: number;
  studyRoomName?: string;
  teacherName?: string;
  canManage?: boolean;
  thumbnailUrl?: string | null;
  onThumbnailClick?: () => void;
  onThumbnailDelete?: () => void;
  isUploading?: boolean;
}) => {
  const router = useRouter();

  return (
    <BaseHeader
      studyRoomId={studyRoomId}
      studyRoomName={studyRoomName}
      teacherName={!canManage ? teacherName : undefined}
      thumbnailUrl={thumbnailUrl}
      onThumbnailClick={onThumbnailClick}
      isUploading={isUploading}
      onThumbnailDelete={onThumbnailDelete}
      teacherSuffix="선생님"
      fallbackStudyRoomName="스터디룸"
      titleClassName="desktop:max-w-[260px] truncate text-[28px] leading-tight font-bold"
      imageWrapperClassName={cn(
        thumbnailUrl ? '' : 'bg-orange-scale-orange-1',
        'tablet:h-[200px] relative h-[150px] w-full overflow-hidden rounded-[12px]'
      )}
      rightSlot={
        canManage ? (
          <DropdownMenu>
            <DropdownMenu.Trigger
              className="flex cursor-pointer items-center justify-center"
              data-testid="study-room-kebab-button"
            >
              <Image
                src="/studyroom/ic-kebab.png"
                alt="kebab-menu"
                width={48}
                height={48}
                className="cursor-pointer self-start rounded-[8px] border-none p-1 hover:bg-gray-100"
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                onClick={() =>
                  dispatch({
                    type: 'OPEN',
                    scope: 'studyroom',
                    kind: 'rename',
                  })
                }
              >
                제목수정
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={() =>
                  router.push(
                    `${PRIVATE.ROOM.EDIT(studyRoomId)}?from=studyroom`
                  )
                }
              >
                편집하기
              </DropdownMenu.Item>

              <DropdownMenu.Item
                variant="danger"
                onClick={() =>
                  dispatch({
                    type: 'OPEN',
                    scope: 'studyroom',
                    kind: 'delete',
                  })
                }
                data-testid="study-room-delete-menu-item"
              >
                삭제하기
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        ) : null
      }
    />
  );
};
