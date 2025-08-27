import Image from 'next/image';

import { DropdownMenu } from '@/components/ui/dropdown-menu';

export const StudyNotesDropdown = ({
  open,
  handleOpen,
  item,
}: {
  open: number;
  handleOpen: (id: number) => void;
  item: {
    id: number;
    title: string;
    group?: string;
    groupId?: number;
    option: string;
  };
}) => {
  return (
    <DropdownMenu
      open={open === item.id}
      onOpenChange={() => handleOpen(item.id)}
    >
      <DropdownMenu.Trigger asChild>
        <Image
          src="/studynotes/more-gray.png"
          width={24}
          height={24}
          alt="study-notes"
          className="cursor-pointer"
          onClick={() => handleOpen(item.id)}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-[110px] justify-center">
        <DropdownMenu.Item
          onClick={() => {}}
          className="justify-center"
        >
          <p>제목수정</p>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={() => {}}
          className="justify-center px-[12px]"
        >
          그룹이동하기
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="justify-center"
          onClick={() => {}}
        >
          편집하기
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="justify-center"
          onClick={() => {}}
        >
          복제하기
        </DropdownMenu.Item>
        <DropdownMenu.Item
          variant="danger"
          className="justify-center"
          onClick={() => {}}
        >
          삭제하기
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
