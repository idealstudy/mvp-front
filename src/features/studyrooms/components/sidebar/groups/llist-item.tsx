'use client';

import { useState } from 'react';

import Image from 'next/image';

import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export const GroupListItem = ({
  group,
  selectedGroupId,
  handleSelectGroup,
  handleRenameGroup,
  handleDeleteGroup,
}: {
  group: { id: number; name: string };
  selectedGroupId: number;
  handleSelectGroup: (id: number) => void;
  handleRenameGroup: () => void;
  handleDeleteGroup: () => void;
}) => {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  return (
    <div
      className={cn(
        'group desktop:max-w-[296px] flex w-full cursor-pointer items-center justify-between gap-[10px] rounded-md px-2 py-3 hover:bg-gray-50',
        selectedGroupId === group.id && 'text-key-color-primary',
        menuOpenId === group.id && 'bg-gray-50'
      )}
      onClick={() => handleSelectGroup(group.id)}
    >
      <div className="flex min-w-0 items-center gap-2">
        <div
          className={cn(
            'bg-gray-scale-gray-60 h-6 w-6 shrink-0 transition-colors duration-200',
            '[mask-image:url("/studyroom/ic-folder.png")]',
            '[mask-size:contain]',
            '[mask-repeat:no-repeat]',
            '[mask-position:center]',
            selectedGroupId === group.id && 'bg-key-color-primary'
          )}
        />
        <p
          className={cn(
            'font-body2-heading text-gray-scale-gray-60 flex-1 truncate',
            selectedGroupId === group.id && 'text-key-color-primary'
          )}
        >
          {group.name}
        </p>
      </div>

      {group.id !== 12 && (
        <DropdownMenu
          open={menuOpenId === group.id}
          onOpenChange={(open) => {
            if (open) {
              handleSelectGroup(group.id);
              setMenuOpenId(group.id);
            } else {
              setMenuOpenId(null);
            }
          }}
        >
          <DropdownMenu.Trigger
            className="flex cursor-pointer items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/studyroom/ic-kebab.png"
              alt="kebab-menu"
              width={24}
              height={24}
              className={cn(
                'hidden shrink-0 cursor-pointer rounded-[8px] p-1 group-hover:block',
                menuOpenId === group.id && 'block'
              )}
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item onClick={handleRenameGroup}>
              편집하기
            </DropdownMenu.Item>
            <DropdownMenu.Item
              variant="danger"
              onClick={handleDeleteGroup}
            >
              삭제하기
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      )}
    </div>
  );
};
