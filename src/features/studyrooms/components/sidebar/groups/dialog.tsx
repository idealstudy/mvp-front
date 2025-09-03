'use client';

import { useState } from 'react';

import { DeleteDialog } from '@/features/studyrooms/components/common/dialog/delete';
import { InputDialog } from '@/features/studyrooms/components/common/dialog/input-dialog';
import { OnConfirmDialog } from '@/features/studyrooms/components/common/dialog/on-confirm';
import {
  DialogAction,
  DialogState,
} from '@/features/studyrooms/hooks/useDialogReducer';

export const StudyroomGroupsDialog = ({
  dialog,
  dispatch,
  handleCreateGroup,
}: {
  dialog: DialogState;
  dispatch: (action: DialogAction) => void;
  handleCreateGroup: (name: string) => void;
}) => {
  const [renameName, setRenameName] = useState<string>('');

  const handleRename = (name: string) => {
    setRenameName(name);
  };

  return (
    <>
      {dialog.status === 'open' &&
        dialog.scope === 'group' &&
        dialog.kind === 'create' &&
        !dialog.payload?.groupId && (
          <InputDialog
            isOpen={true}
            placeholder="수업노트 그룹명을 입력해주세요"
            onOpenChange={() => dispatch({ type: 'CLOSE' })}
            title="수업노트 그룹 생성"
            description="수업노트 그룹명을 입력해 주세요"
            onSubmit={() => handleCreateGroup(renameName)}
          />
        )}

      {dialog.status === 'open' &&
        dialog.scope === 'group' &&
        dialog.kind === 'rename' &&
        dialog.payload?.groupId && (
          <InputDialog
            isOpen={true}
            placeholder={dialog.payload?.initialTitle || ''}
            onOpenChange={() => dispatch({ type: 'CLOSE' })}
            title="수업노트 그룹 수정"
            description="수업노트 그룹명"
            onSubmit={() => handleRename(renameName)}
          />
        )}

      {dialog.status === 'open' &&
        dialog.scope === 'group' &&
        dialog.kind === 'delete' && (
          <DeleteDialog
            open={true}
            onCancel={() => dispatch({ type: 'CLOSE' })}
            onOpenChange={() => dispatch({ type: 'CLOSE' })}
            onConfirm={() => dispatch({ type: 'GO_TO_CONFIRM' })}
            title="수업 노트 그룹을 삭제하시겠습니까?"
            description="삭제된 수업노트 그룹은 복구할 수 없습니다."
          />
        )}

      {dialog.status === 'open' &&
        dialog.scope === 'group' &&
        dialog.kind === 'onConfirm' && (
          <OnConfirmDialog
            open={true}
            dispatch={dispatch}
            description="수업노트 그룹이 삭제되었습니다."
          />
        )}
    </>
  );
};
