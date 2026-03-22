'use client';

import Image from 'next/image';

import { DropdownMenu } from '@/shared/components/ui/dropdown-menu';

export const CommentDropdown = ({
  isOwner,
  canReply = true,
  onReply,
  onEdit,
  setIsDialogOpen,
}: {
  isOwner: boolean;
  canReply?: boolean;
  onReply?: () => void;
  onEdit?: () => void;
  setIsDialogOpen: (a: boolean) => void;
}) => {
  if (!isOwner && !canReply) {
    return null;
  }

  return (
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
        {canReply && (
          <DropdownMenu.Item
            onSelect={onReply}
            className="justify-center"
          >
            답글 남기기
          </DropdownMenu.Item>
        )}
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
  );
};
