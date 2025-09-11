'use client';

import { useReducer, useState } from 'react';

import { ColumnLayout } from '@/components/layout/column-layout';
import { ConfirmDialog } from '@/features/studyrooms/components/common/dialog/confirm-dialog';
import { InputDialog } from '@/features/studyrooms/components/common/dialog/input-dialog';
import {
  dialogReducer,
  initialDialogState,
} from '@/features/studyrooms/hooks/useDialogReducer';

import { StudyroomGroups } from './groups/index';
import { StudyroomSidebarHeader } from './header';
import { useDeleteStudyRoom } from './services/query';
import { StudyStats } from './status';

export const StudyroomSidebar = ({
  studyRoomId,
  selectedGroupId,
  handleSelectGroupId,
}: {
  studyRoomId: number;
  selectedGroupId: number | 'all';
  handleSelectGroupId: (id: number | 'all') => void;
}) => {
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);
  const [roomName, setRoomName] = useState('');
  const [deleteNoticeMsg, setDeleteNoticeMsg] =
    useState('수업노트 그룹이 삭제되었습니다.');

  const { mutate: deleteStudyRoom } = useDeleteStudyRoom();

  // TODO: 스터디룸 이름 변경 API 연결
  const handleSubmitRoomRename = (name: string) => {
    setRoomName(name);
    dispatch({ type: 'CLOSE' });
  };

  // TODO: 스터디룸 삭제 API 연결
  const handleDeleteGroup = () => {
    deleteStudyRoom({ studyRoomId });
    setDeleteNoticeMsg('스터디룸이 삭제되었습니다.');
    dispatch({ type: 'GO_TO_CONFIRM' });
  };

  return (
    <>
      {dialog.status === 'open' && dialog.kind === 'onConfirm' && (
        <ConfirmDialog
          type="confirm"
          open={true}
          dispatch={dispatch}
          description={deleteNoticeMsg}
        />
      )}

      {dialog.status === 'open' &&
        dialog.kind === 'delete' &&
        dialog.scope === 'studyroom' && (
          <ConfirmDialog
            type="delete"
            open={true}
            dispatch={dispatch}
            onDelete={() => handleDeleteGroup()}
            title="스터디룸을 삭제하시겠습니까?"
            description="삭제된 스터디룸은 복구할 수 없습니다."
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
        {/* TODO: 스터디룸 수업노트, 학생, 질문 카운트 추가 */}
        <StudyStats />
        <StudyroomGroups
          studyRoomId={studyRoomId}
          selectedGroupId={selectedGroupId}
          handleSelectGroupId={handleSelectGroupId}
        />
        {/* TODO: 마지막 활동 시간 추가 */}
        <div className="font-body2-normal text-gray-scale-gray-60 flex items-end justify-end">
          <p className="text-right">마지막 활동 3일전</p>
        </div>
      </ColumnLayout.Left>
    </>
  );
};
