'use client';

import { Dispatch } from 'react';

import Image from 'next/image';

import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { DialogAction } from '@/features/studyrooms/hooks/useDialogReducer';

export const StudyroomSidebarHeader = ({
  dispatch,
}: {
  dispatch: Dispatch<DialogAction>;
}) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <p className="desktop:max-w-[260px] text-[28px] leading-tight font-bold">
          에듀중학교 복습반ㅇㄷㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇ
        </p>
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
                dispatch({ type: 'OPEN', scope: 'studyroom', kind: 'rename' })
              }
            >
              편집하기
            </DropdownMenu.Item>
            <DropdownMenu.Item
              variant="danger"
              onClick={() =>
                dispatch({ type: 'OPEN', scope: 'studyroom', kind: 'delete' })
              }
            >
              삭제하기
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
      <Image
        src="/studyroom/study-room-profile.svg"
        alt="select-area"
        className="bg-orange-scale-orange-1 rounded-[12px] p-[14px]"
        width={300}
        height={300}
      />
    </>
  );
};
