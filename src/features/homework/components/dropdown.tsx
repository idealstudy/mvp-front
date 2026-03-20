import { useReducer } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import type { Homework } from '@/entities/homework/types';
import { dialogReducer, initialDialogState } from '@/shared/components/dialog';
import { DropdownMenu } from '@/shared/components/ui/dropdown-menu';

import { HomeworkDialog } from './dialog';

export const HomeworkDropdown = ({
  studyRoomId,
  open,
  handleOpen,
  item,
  onRefresh,
}: {
  studyRoomId: number;
  open: number;
  handleOpen: (id: number) => void;
  item: Homework;
  onRefresh: () => void;
}) => {
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);
  const handleDelete = () => {
    dispatch({
      type: 'OPEN',
      scope: 'homework',
      kind: 'delete',
      payload: {
        homeworkId: item.id,
      },
    });
  };

  return (
    <>
      <HomeworkDialog
        state={dialog}
        dispatch={dispatch}
        onRefresh={onRefresh}
        studyRoomId={studyRoomId}
        homeworkId={item.id}
      />

      <DropdownMenu
        open={open === item.id}
        onOpenChange={() => handleOpen(item.id)}
      >
        <DropdownMenu.Trigger asChild>
          <Image
            src="/studynotes/gray-kebab.svg"
            width={24}
            height={24}
            alt="homework"
            className="hover:bg-gray-scale-gray-5 cursor-pointer rounded"
            onClick={() => handleOpen(item.id)}
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-[110px] justify-center">
          <DropdownMenu.Item asChild>
            <Link
              href={`/study-rooms/${studyRoomId}/homework/${item.id}/edit`}
              className="justify-center border-none focus:ring-0 focus:outline-none"
            >
              수정하기
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            variant="danger"
            className="justify-center"
            onClick={handleDelete}
          >
            삭제하기
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
};
