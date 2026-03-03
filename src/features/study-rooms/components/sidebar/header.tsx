'use client';

import { Dispatch } from 'react';

import Image from 'next/image';

import { DialogAction } from '@/shared/components/dialog';
import { BaseHeader } from '@/shared/components/sidebar';
import { DropdownMenu } from '@/shared/components/ui/dropdown-menu';

export const StudyroomSidebarHeader = ({
  dispatch,
  studyRoomId,
  studyRoomName,
  teacherName,
  canManage,
}: {
  dispatch: Dispatch<DialogAction>;
  studyRoomId: number;
  studyRoomName?: string;
  teacherName?: string;
  canManage?: boolean;
}) => {
  return (
    <BaseHeader
      studyRoomId={studyRoomId}
      studyRoomName={studyRoomName}
      teacherName={!canManage ? teacherName : undefined}
      teacherSuffix="선생님"
      fallbackStudyRoomName="스터디룸"
      titleClassName="desktop:max-w-[260px] truncate text-[28px] leading-tight font-bold"
      imageWrapperClassName="bg-orange-scale-orange-1 relative mx-auto h-[300px] w-full overflow-hidden rounded-[12px]"
      rightSlot={
        canManage ? (
          <DropdownMenu>
            <DropdownMenu.Trigger className="flex cursor-pointer items-center justify-center">
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
