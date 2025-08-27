import { useReducer } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { DropdownMenu } from '@/components/ui/dropdown-menu';

import { dialogReducer, initialDialogState } from '../hook/dialog-reducer';
import { StudyNotesDialog } from './dialog';

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
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);

  return (
    <>
      <StudyNotesDialog
        state={dialog}
        dispatch={dispatch}
      />
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
            onClick={() =>
              dispatch({
                type: 'OPEN_RENAME',
                initialTitle: item.title,
              })
            }
            className="justify-center"
          >
            <p>제목수정</p>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => dispatch({ type: 'OPEN_GROUP_MOVE' })}
            className="justify-center px-[12px]"
          >
            그룹이동하기
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              href={`/dashboard/studynote/${item.id}/write`}
              className="justify-center border-none"
            >
              편집하기
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="justify-center"
            // onClick={() => setOpenDialog('copy')}
          >
            복제하기
          </DropdownMenu.Item>
          <DropdownMenu.Item
            variant="danger"
            className="justify-center"
            onClick={() =>
              dispatch({
                type: 'OPEN_DELETE',
                noteId: item.id.toString(),
                title: item.title,
              })
            }
          >
            삭제하기
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
};
