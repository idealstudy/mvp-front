'use client';

import { ConfirmDialog } from '@/features/studyrooms/components/common/dialog/confirm-dialog';
import { InputDialog } from '@/features/studyrooms/components/common/dialog/input-dialog';
import {
  DialogAction,
  DialogState,
} from '@/features/studyrooms/hooks/useDialogReducer';

import { useDeleteStudyNoteGroup } from '../services/query';
import {
  useCreateStudyNoteGroup,
  useUpdateStudyNoteGroup,
} from '../services/query';

export const StudyroomGroupDialogs = ({
  dialog,
  dispatch,
  studyRoomId,
  selectedGroupId,
  handleSelectGroupId,
}: {
  dialog: DialogState;
  dispatch: (action: DialogAction) => void;
  studyRoomId: number;
  selectedGroupId: number;
  handleSelectGroupId: (id: number | 'all') => void;
}) => {
  const { mutate: createStudyNoteGroup } = useCreateStudyNoteGroup();
  const { mutate: updateStudyNoteGroup } = useUpdateStudyNoteGroup();
  const { mutate: deleteStudyNoteGroup } = useDeleteStudyNoteGroup();

  const handleCreateGroup = (title: string) => {
    createStudyNoteGroup({ studyRoomId, title });
  };
  const handleRename = (name: string) => {
    updateStudyNoteGroup({
      teachingNoteGroupId: selectedGroupId,
      title: name,
      studyRoomId,
    });
    dispatch({ type: 'CLOSE' });
  };

  const handleDeleteGroup = () => {
    handleSelectGroupId('all');
    deleteStudyNoteGroup({
      teachingNoteGroupId: selectedGroupId,
      studyRoomId,
    });
    dispatch({ type: 'GO_TO_CONFIRM' });
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
            onSubmit={(name) => handleCreateGroup(name)}
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
            onSubmit={(name) => handleRename(name)}
          />
        )}

      {dialog.status === 'open' &&
        dialog.scope === 'group' &&
        dialog.kind === 'delete' && (
          <ConfirmDialog
            type="delete"
            open={true}
            dispatch={dispatch}
            onDelete={() => handleDeleteGroup()}
            title="수업 노트 그룹을 삭제하시겠습니까?"
            description="삭제된 수업노트 그룹은 복구할 수 없습니다."
          />
        )}

      {dialog.status === 'open' &&
        dialog.scope === 'group' &&
        dialog.kind === 'onConfirm' && (
          <ConfirmDialog
            type="confirm"
            open={true}
            dispatch={dispatch}
            description="수업노트 그룹이 삭제되었습니다."
          />
        )}
    </>
  );
};
