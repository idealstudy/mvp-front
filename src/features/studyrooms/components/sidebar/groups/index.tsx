'use client';

import { useReducer, useState } from 'react';

import Image from 'next/image';

import {
  dialogReducer,
  initialDialogState,
} from '@/features/studyrooms/hooks/useDialogReducer';

import { CreateGroupDialog } from './create-dialog';
import { DeleteGroupDialog } from './delete-dialog';
import { GroupListItem } from './llist-item';
import { RenameGroupDialog } from './rename-dialog';

export const StudyroomGroups = ({
  groups,
  handleGroupDeleteConfirmAction,
}: {
  groups: { id: number; name: string }[];
  handleGroupDeleteConfirmAction: () => void;
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<number>(12);
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);

  const handleSelectGroup = (id: number) => {
    setSelectedGroupId(id);
  };

  const handleGroupAction = (action: 'create' | 'rename' | 'delete') => {
    switch (action) {
      case 'create':
        dispatch({
          type: 'OPEN',
          scope: 'group',
          kind: 'rename', // create는 rename kind로 처리
          payload: { groupId: undefined },
        });
        break;
      case 'rename':
        dispatch({
          type: 'OPEN',
          scope: 'group',
          kind: 'rename',
          payload: {
            groupId: selectedGroupId.toString(),
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
            groupId: selectedGroupId.toString(),
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
        dialog.kind === 'rename' &&
        !dialog.payload?.groupId && (
          <CreateGroupDialog
            isOpen={true}
            onOpenChange={() => dispatch({ type: 'CLOSE' })}
          />
        )}

      {dialog.status === 'open' &&
        dialog.scope === 'group' &&
        dialog.kind === 'rename' &&
        dialog.payload?.groupId && (
          <RenameGroupDialog
            isOpen={true}
            initialGroupName={dialog.payload?.initialTitle || ''}
            onOpenChange={() => dispatch({ type: 'CLOSE' })}
          />
        )}

      {dialog.status === 'open' &&
        dialog.scope === 'group' &&
        dialog.kind === 'delete' && (
          <DeleteGroupDialog
            isOpen={true}
            onOpenChange={() => dispatch({ type: 'CLOSE' })}
            onConfirm={handleGroupDeleteConfirmAction}
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
