'use client';

import { useState } from 'react';

import Image from 'next/image';

import { CreateGroupDialog } from './create-dialog';
import { DeleteGroupDialog } from './delete-dialog';
import { GroupListItem } from './llist-item';
import { RenameGroupDialog } from './rename-dialog';

type GroupDialogType = 'create' | 'rename' | 'delete' | null;

interface GroupDialogData {
  groupId?: number;
  currentName?: string;
  groupName?: string;
}

interface GroupDialogState {
  isOpen: boolean;
  type: GroupDialogType;
  data?: GroupDialogData;
}

export const StudyroomGroups = ({
  groups,
  handleGroupDeleteConfirmAction,
}: {
  groups: { id: number; name: string }[];
  handleGroupDeleteConfirmAction: () => void;
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<number>(12);
  const [groupDialog, setGroupDialog] = useState<GroupDialogState>({
    isOpen: false,
    type: null,
  });

  const handleSelectGroup = (id: number) => {
    setSelectedGroupId(id);
  };

  const openGroupDialog = (type: GroupDialogType, data?: GroupDialogData) => {
    setGroupDialog({ isOpen: true, type, data });
  };

  const closeGroupDialog = () => {
    setGroupDialog({ isOpen: false, type: null, data: undefined });
  };

  const handleGroupAction = (action: GroupDialogType) => {
    switch (action) {
      case 'create':
        openGroupDialog('create');
        break;
      case 'rename':
        openGroupDialog('rename', {
          groupId: selectedGroupId,
          currentName: groups.find((g) => g.id === selectedGroupId)?.name,
        });
        break;
      case 'delete':
        openGroupDialog('delete', {
          groupId: selectedGroupId,
          groupName: groups.find((g) => g.id === selectedGroupId)?.name,
        });
        break;
    }
  };

  return (
    <>
      {groupDialog.isOpen && (
        <>
          {groupDialog.type === 'create' && (
            <CreateGroupDialog
              isOpen={true}
              onOpenChange={closeGroupDialog}
            />
          )}

          {groupDialog.type === 'rename' && (
            <RenameGroupDialog
              isOpen={true}
              initialGroupName={groupDialog.data?.currentName || ''}
              onOpenChange={closeGroupDialog}
            />
          )}

          {groupDialog.type === 'delete' && (
            <DeleteGroupDialog
              isOpen={true}
              onOpenChange={closeGroupDialog}
              onConfirm={handleGroupDeleteConfirmAction}
            />
          )}
        </>
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
