'use client';

import Image from 'next/image';

import { DropdownMenu } from '@/shared/components/ui/dropdown-menu';

export const CommentDropdown = ({
  isOwner,
  onReply,
  onEdit,
  setIsDialogOpen,
}: {
  isOwner: boolean;
  onReply?: () => void;
  onEdit?: () => void;
  setIsDialogOpen: (a: boolean) => void;
}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger className="hover:bg-gray-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm">
          <Image
            src="/studynotes/gray-kebab.svg"
            alt="kebab-menu"
            height={24}
            width={24}
            className="h-4 w-4"
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-[120px]">
          <DropdownMenu.Item
            onSelect={onReply}
            className="justify-center"
          >
            답장 남기기
          </DropdownMenu.Item>
          {isOwner && (
            <>
              <DropdownMenu.Item
                onSelect={onEdit}
                className="justify-center"
              >
                수정하기
              </DropdownMenu.Item>
              <DropdownMenu.Item
                variant="danger"
                onSelect={() => setIsDialogOpen(true)}
                className="justify-center"
              >
                삭제하기
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
};
