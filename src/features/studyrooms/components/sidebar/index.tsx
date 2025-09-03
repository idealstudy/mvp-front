'use client';

import { useReducer, useState } from 'react';

import { ColumnLayout } from '@/components/layout/column-layout';
import { DeleteDialog } from '@/features/studyrooms/components/common/dialog/delete';
import { InputDialog } from '@/features/studyrooms/components/common/dialog/input-dialog';
import { OnConfirmDialog } from '@/features/studyrooms/components/common/dialog/on-confirm';
import {
  dialogReducer,
  initialDialogState,
} from '@/features/studyrooms/hooks/useDialogReducer';

import { StudyroomGroups } from './groups/index';
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

  const handleSubmitRoomRename = (name: string) => {
    setRoomName(name);
    dispatch({ type: 'CLOSE' });
  };

  return (
    <>
      {dialog.status === 'open' && dialog.kind === 'onConfirm' && (
        <OnConfirmDialog
          open={true}
          dispatch={dispatch}
          description={deleteNoticeMsg}
        />
      )}

      {dialog.status === 'open' &&
        dialog.kind === 'delete' &&
        dialog.scope === 'studyroom' && (
          <DeleteDialog
            open={true}
            onCancel={() => dispatch({ type: 'CLOSE' })}
            onOpenChange={() => dispatch({ type: 'CLOSE' })}
            onConfirm={() => dispatch({ type: 'GO_TO_CONFIRM' })}
            title="스터디룸을 삭제하시겠습니까?"
            description="삭제된 스터디룸은 복구할 수 없습니다."
            handleDeleteMsg={() =>
              setDeleteNoticeMsg('스터디룸이 삭제되었습니다.')
            }
          />
        )}

      {dialog.status === 'open' &&
        dialog.kind === 'rename' &&
        dialog.scope === 'studyroom' && (
          <InputDialog
            isOpen={true}
            placeholder="에듀중학교 복습반ㅇㄷㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇㄹㅇ"
            onOpenChange={() => dispatch({ type: 'CLOSE' })}
            title="스터디룸 이름 변경"
            onSubmit={() => handleSubmitRoomRename(roomName)}
          />
        )}

      <ColumnLayout.Left className="border-line-line1 flex h-fit flex-col gap-5 rounded-xl border bg-white px-8 py-8">
        <StudyroomSidebarHeader dispatch={dispatch} />
        <StudyStats />
        <StudyroomGroups groups={studyroomGroups} />
        <div className="font-body2-normal text-gray-scale-gray-60 flex items-end justify-end">
          <p className="text-right">마지막 활동 3일전</p>
        </div>
      </ColumnLayout.Left>
    </>
  );
};
