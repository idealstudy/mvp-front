import { useReducer } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { DropdownMenu } from '@/components/ui/dropdown-menu';
import {
  dialogReducer,
  initialDialogState,
} from '@/features/studyrooms/hooks/useDialogReducer';

import { StudyNotesDialog } from './dialog';
import type { StudyNote } from './type';
import type { StudyNoteGroupPageable } from './type';

export const StudyNotesDropdown = ({
  studyRoomId,
  open,
  handleOpen,
  item,
  pageable,
  keyword,
}: {
  studyRoomId: number;
  open: number;
  handleOpen: (id: number) => void;
  item: StudyNote;
  pageable: StudyNoteGroupPageable;
  keyword: string;
}) => {
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);

  const handleCopy = () => {
    // TODO: 수업노트 복제 API 호출 후 상태 업데이트 로직 넣기
  };

  const handleDelete = () => {
    // TODO: 수업노트 삭제 API 호출 후 상태 업데이트 로직 넣기
    dispatch({
      type: 'OPEN',
      scope: 'note',
      kind: 'delete',
      payload: {
        noteId: item.id,
      },
    });
  };

  return (
    <>
      {dialog.status === 'open' && (
        <StudyNotesDialog
          state={dialog}
          dispatch={dispatch}
          studyRoomId={studyRoomId}
          pageable={pageable}
          keyword={keyword}
          item={item}
        />
      )}
      <DropdownMenu
        open={open === item.id}
        onOpenChange={() => handleOpen(item.id)}
      >
        <DropdownMenu.Trigger asChild>
          <Image
            src="/studynotes/gray-kebab.svg"
            width={24}
            height={24}
            alt="study-notes"
            className="cursor-pointer"
            onClick={() => handleOpen(item.id)}
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-[110px] justify-center">
          <DropdownMenu.Item
            onClick={() => {
              dispatch({
                type: 'OPEN',
                scope: 'note',
                kind: 'rename',
                payload: {
                  initialTitle: item.title,
                },
              });
            }}
            className="justify-center"
          >
            <p>제목수정</p>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => {
              dispatch({
                type: 'OPEN',
                scope: 'note',
                kind: 'group-move',
                payload: {
                  noteId: item.id,
                },
              });
            }}
            className="justify-center px-[12px]"
          >
            그룹이동하기
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              href={`/dashboard/studynote/${item.id}/write`}
              className="justify-center border-none focus:ring-0 focus:outline-none"
            >
              편집하기
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="justify-center"
            onClick={() => {
              handleCopy();
            }}
          >
            복제하기
          </DropdownMenu.Item>
          <DropdownMenu.Item
            variant="danger"
            className="justify-center"
            onClick={() => handleDelete()}
          >
            삭제하기
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
};
