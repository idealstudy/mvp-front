'use client';

import { useReducer, useState } from 'react';

import Image from 'next/image';

import { DeleteDialog } from '@/features/studyrooms/components/common/dialog/delete';
import { InputDialog } from '@/features/studyrooms/components/common/dialog/input-dialog';
import { OnConfirmDialog } from '@/features/studyrooms/components/common/dialog/on-confirm';
import {
  dialogReducer,
  initialDialogState,
} from '@/features/studyrooms/hooks/useDialogReducer';

import { GroupListItem } from './llist-item';

export const StudyroomGroups = ({
  groups,
}: {
  groups: { id: number; name: string }[];
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<number>(12);
  const [renameName, setRenameName] = useState<string>('');
  const [createGroupName, setCreateGroupName] = useState<string>('');
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);

  const handleSelectGroup = (id: number) => {
    setSelectedGroupId(id);
  };

  const handleRename = (name: string) => {
    setRenameName(name);
  };

  const handleCreateGroup = (name: string) => {
    setCreateGroupName(name);
  };

  const handleGroupAction = (action: 'create' | 'rename' | 'delete') => {
    switch (action) {
      case 'create':
        dispatch({
          type: 'OPEN',
          scope: 'group',
          kind: 'create',
          payload: { groupId: undefined, initialTitle: createGroupName },
        });
        break;
      case 'rename':
        dispatch({
          type: 'OPEN',
          scope: 'group',
          kind: 'rename',
          payload: {
            groupId: selectedGroupId,
            initialTitle: groups.find((g) => g.id === selectedGroupId)?.name,
          },
        });
        break;
      case 'delete':
        dispatch({
          type: 'OPEN',
          scope: 'group',
          kind: 'delete',
          payload: {
            groupId: selectedGroupId,
            title: groups.find((g) => g.id === selectedGroupId)?.name,
          },
        });
        break;
    }
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
            description="삭제된 수업노트 그룹은 복구할 수 없습니다."
          />
        )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="font-body1-heading">수업노트 그룹</p>
          <Image
            src="/studyroom/ic-plus.png"
            alt="plus"
            width={24}
            height={24}
            className="hover:bg-gray-scale-gray-5 cursor-pointer rounded-[8px] p-1"
            onClick={() => handleGroupAction('create')}
          />
        </div>
        <div className="desktop:max-h-[880px] flex flex-col overflow-y-auto">
          {groups.map((group) => (
            <GroupListItem
              key={group.id}
              group={group}
              selectedGroupId={selectedGroupId}
              handleSelectGroup={handleSelectGroup}
              handleRenameGroup={() => handleGroupAction('rename')}
              handleDeleteGroup={() => handleGroupAction('delete')}
            />
          ))}
        </div>
      </div>
    </>
  );
};
