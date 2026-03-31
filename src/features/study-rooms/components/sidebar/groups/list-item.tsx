'use client';

import { useState } from 'react';

import Image from 'next/image';

import { DialogAction } from '@/shared/components/dialog';
import { DropdownMenu } from '@/shared/components/ui/dropdown-menu';
import { useRole } from '@/shared/hooks/use-role';
import { cn } from '@/shared/lib/utils';

export const GroupListItem = ({
  group,
  selectedGroupId,
  handleSelectGroup,
  dispatch,
}: {
  group: { id: number | 'all'; title: string };
  selectedGroupId: number | 'all';
  handleSelectGroup: (id: number | 'all') => void;
  dispatch: (action: DialogAction) => void;
}) => {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const { role } = useRole();

  const handleRenameGroup = () => {
    if (group.id === 'all') return;
    dispatch({
      type: 'OPEN',
      scope: 'group',
      kind: 'rename',
      payload: { groupId: group.id, initialTitle: group.title },
    });
  };

  const handleDeleteGroup = () => {
    if (group.id === 'all') return;
    dispatch({
      type: 'OPEN',
      scope: 'group',
      kind: 'delete',
      payload: { groupId: group.id, title: group.title },
    });
  };

  return (
    <div
      className={cn(
        'group desktop:max-w-[296px] hover:bg-gray-scale-gray-1 flex w-full cursor-pointer items-center justify-between gap-[10px] rounded-[8px] px-2 py-3',
        selectedGroupId === group.id && 'text-key-color-primary'
      )}
      onClick={() => handleSelectGroup(group.id)}
    >
      <div className="flex min-w-0 items-center gap-2">
        <div
          className={cn(
            'bg-gray-scale-gray-60 h-6 w-6 shrink-0 transition-colors duration-200',
            '[mask-image:url("/studyroom/ic-folder.svg")]',
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
          {group.title}
        </p>
      </div>

      {group.id !== 'all' && role === 'ROLE_TEACHER' && (
        <DropdownMenu
          open={menuOpenId === group.id}
          onOpenChange={(open) => {
            if (open) {
              handleSelectGroup(group.id);
              setMenuOpenId(group.id as number);
            } else {
              setMenuOpenId(null);
            }
          }}
        >
          <DropdownMenu.Trigger className="flex cursor-pointer justify-center">
            <Image
              src="/studyroom/ic-kebab.png"
              alt="kebab-menu"
              width={24}
              height={24}
              className={cn(
                'hidden shrink-0 cursor-pointer group-hover:block',
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
