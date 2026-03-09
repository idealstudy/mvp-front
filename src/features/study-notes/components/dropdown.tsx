import { useReducer } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  StudyNote,
  StudyNoteGroupPageable,
} from '@/features/study-notes/model';
import { dialogReducer, initialDialogState } from '@/shared/components/dialog';
import { DropdownMenu } from '@/shared/components/ui/dropdown-menu';

import { StudyNotesDialog } from './dialog';

export const StudyNotesDropdown = ({
  studyRoomId,
  open,
  handleOpen,
  item,
  pageable,
  keyword,
  onRefresh,
}: {
  studyRoomId: number;
  open: number;
  handleOpen: (id: number) => void;
  item: StudyNote;
  pageable: StudyNoteGroupPageable;
  keyword: string;
  onRefresh: () => void;
}) => {
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);

  const handleDelete = () => {
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
          onRefresh={onRefresh}
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
            className="hover:bg-gray-scale-gray-5 cursor-pointer rounded" // 3단 점을 누르는건지 수업노트를 누르는건지 구분 필요
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
              href={`/study-rooms/${studyRoomId}/note/${item.id}/edit`}
              className="justify-center border-none focus:ring-0 focus:outline-none"
            >
              편집하기
            </Link>
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
