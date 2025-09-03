'use client';

import { useReducer, useState } from 'react';

import { ColumnLayout } from '@/components/layout/column-layout';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { TextField } from '@/components/ui/text-field';
import {
  dialogReducer,
  initialDialogState,
} from '@/features/studyrooms/hooks/useDialogReducer';

import { StudyroomGroups } from './groups';
import { StudyroomSidebarHeader } from './header';
import { StudyStats } from './studyStats';

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
    name: '가가중가가중가가중가가중가',
  },
];

export const StudyroomSidebar = () => {
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);
  const [roomName, setRoomName] = useState('');
  const [deleteNoticeMsg, setDeleteNoticeMsg] =
    useState('수업노트 그룹이 삭제되었습니다.');

  const handleSubmitRoomRename = () => {
    setRoomName('');
    dispatch({ type: 'CLOSE' });
  };

  const handleDeleteRoom = () => {
    dispatch({ type: 'CLOSE' });
    setDeleteNoticeMsg('스터디룸이 삭제되었습니다.');
    dispatch({
      type: 'OPEN',
      scope: 'studyroom',
      kind: 'onConfirm',
    });
  };

  return (
    <>
      {dialog.status === 'open' && dialog.kind === 'onConfirm' && (
        <Dialog
          isOpen={true}
          onOpenChange={() => dispatch({ type: 'CLOSE' })}
        >
          <Dialog.Content className="w-[598px]">
            <Dialog.Header>
              <Dialog.Title></Dialog.Title>
            </Dialog.Header>
            <Dialog.Body className="mt-6">
              <Dialog.Description className="font-headline1-heading text-center font-bold">
                {deleteNoticeMsg}
              </Dialog.Description>
            </Dialog.Body>
            <Dialog.Footer className="mt-6 justify-center">
              <Dialog.Close asChild>
                <Button
                  className="w-[120px]"
                  size="small"
                  onClick={() => dispatch({ type: 'CLOSE' })}
                >
                  확인
                </Button>
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      )}

      {dialog.status === 'open' &&
        dialog.kind === 'delete' &&
        dialog.scope === 'studyroom' && (
          <Dialog
            isOpen={true}
            onOpenChange={() => dispatch({ type: 'CLOSE' })}
          >
            <Dialog.Content className="w-[598px]">
              <Dialog.Header>
                <Dialog.Title>스터디룸 삭제</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body className="mt-6">
                <Dialog.Description className="font-headline2-heading mb-1">
                  스터디룸을 삭제하시겠습니까?
                </Dialog.Description>
              </Dialog.Body>
              <Dialog.Footer className="mt-6 justify-end">
                <Dialog.Close asChild>
                  <Button
                    variant="outlined"
                    className="w-[120px]"
                    size="small"
                    onClick={() => dispatch({ type: 'CLOSE' })}
                  >
                    취소
                  </Button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <Button
                    className="w-[120px]"
                    size="small"
                    variant="secondary"
                    onClick={handleDeleteRoom}
                  >
                    삭제
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        )}

      {dialog.status === 'open' &&
        dialog.kind === 'rename' &&
        dialog.scope === 'studyroom' && (
          <Dialog
            isOpen={true}
            onOpenChange={() => dispatch({ type: 'CLOSE' })}
          >
            <Dialog.Content className="w-[598px]">
              <Dialog.Header>
                <Dialog.Title>스터디룸 이름 변경</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body className="mt-6">
                <TextField>
                  <TextField.Input
                    placeholder="변경할 스터디룸 이름을 입력해주세요."
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    maxLength={15}
                  />
                </TextField>
              </Dialog.Body>
              <Dialog.Footer className="mt-6 justify-end">
                <Dialog.Close asChild>
                  <Button
                    className="w-[120px]"
                    disabled={!roomName.trim()}
                    onClick={handleSubmitRoomRename}
                    size="small"
                  >
                    변경하기
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        )}

      <ColumnLayout.Left className="border-line-line1 flex h-fit flex-col gap-5 rounded-xl border bg-white px-8 py-8">
        <StudyroomSidebarHeader studyRoomId="1" />
        <StudyStats />
        <StudyroomGroups
          groups={studyroomGroups}
          handleGroupDeleteConfirmAction={() =>
            dispatch({
              type: 'OPEN',
              scope: 'group',
              kind: 'onConfirm',
            })
          }
        />
        <div className="font-body2-normal text-gray-scale-gray-60 flex items-end justify-end">
          <p className="text-right">마지막 활동 3일전</p>
        </div>
      </ColumnLayout.Left>
    </>
  );
};
