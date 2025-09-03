'use client';

import { useState } from 'react';

import Image from 'next/image';

import { DropdownMenu } from '@/components/ui/dropdown-menu';

export const StudyroomSidebarHeader = ({
  handleRoomRename,
  handleDeleteRoom,
}: {
  handleRoomRename: () => void;
  handleDeleteRoom: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex items-start justify-between">
        <p className="desktop:max-w-[260px] text-[28px] leading-tight font-bold">
          에듀중학교 복습반ㅇㄷㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇ
        </p>
        <DropdownMenu
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <DropdownMenu.Trigger className="flex cursor-pointer items-center justify-center">
            <Image
              src="/studyroom/ic-kebab.png"
              alt="kebab-menu"
              width={48}
              height={48}
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer self-start rounded-[8px] border-none p-1 hover:bg-gray-100"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item onClick={handleRoomRename}>
              편집하기
            </DropdownMenu.Item>
            <DropdownMenu.Item
              variant="danger"
              onClick={handleDeleteRoom}
            >
              삭제하기
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
      <Image
        src="/studyroom/study-room-profile.png"
        alt="select-area"
        className="bg-orange-scale-orange-1 rounded-[12px] p-[14px]"
        width={300}
        height={300}
      />
    </>
  );
};
