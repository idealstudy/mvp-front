'use client';

import Image from 'next/image';

import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export const StudyroomList = ({
  handleRenameGroup,
  handleDeleteGroup,
  selectedGroupId,
  handleSelectGroup,
}: {
  handleRenameGroup: (groupId: number) => void;
  handleDeleteGroup: (groupId: number) => void;
  handleSelectGroup: (groupId: number) => void;
  selectedGroupId: number;
}) => {
  const studyroomGroups = [
    {
      id: 12,
      name: '전체보기',
    },
    {
      id: 2,
      name: '가가중가가중가가중가가중가가중중중',
    },
    {
      id: 3,
      name: '가가중가가중가가중가가중',
    },
  ];

  return (
    <div className="flex flex-col">
      {studyroomGroups.map((group) => (
        <div
          key={group.id}
          className={cn(
            'group desktop:max-w-[296px] flex w-full cursor-pointer items-center justify-between gap-[10px] rounded-md px-2 py-3 hover:bg-gray-50',
            selectedGroupId === group.id && 'text-key-color-primary'
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

          <DropdownMenu
            open={selectedGroupId === group.id}
            onOpenChange={() => handleSelectGroup(group.id)}
          >
            <DropdownMenu.Trigger className="flex cursor-pointer items-center justify-center">
              <Image
                src="/studyroom/ic-kebab.png"
                alt="kebab-menu"
                width={24}
                height={24}
                className="hover:bg-gray-scale-gray-5 hidden shrink-0 cursor-pointer rounded-[8px] p-1 group-hover:block"
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item onClick={() => handleRenameGroup(group.id)}>
                편집하기
              </DropdownMenu.Item>
              <DropdownMenu.Item
                variant="danger"
                onClick={() => handleDeleteGroup(group.id)}
              >
                삭제하기
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};
