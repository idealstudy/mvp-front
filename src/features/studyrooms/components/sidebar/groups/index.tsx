import { useReducer, useState } from 'react';

import Image from 'next/image';

import {
  dialogReducer,
  initialDialogState,
} from '@/features/studyrooms/hooks/useDialogReducer';

import { StudyroomGroupDialogs } from './dialogs.tsx';
import { GroupListItem } from './llist-item';

export const StudyroomGroups = ({
  groups,
}: {
  groups: { id: number; name: string }[];
}) => {
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(12);

  const handleSelectGroup = (id: number) => {
    setSelectedGroupId(id);
  };

  const handleCreateGroup = () => {
    dispatch({
      type: 'OPEN',
      scope: 'group',
      kind: 'create',
      payload: { groupId: undefined, initialTitle: '' },
    });
  };

  return (
    <>
      <StudyroomGroupDialogs
        dialog={dialog}
        dispatch={dispatch}
        handleCreateGroup={handleCreateGroup}
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="font-body1-heading">수업노트 그룹</p>
          <Image
            src="/studyroom/ic-plus.png"
            alt="plus"
            width={24}
            height={24}
            className="hover:bg-gray-scale-gray-5 cursor-pointer rounded-[8px] p-1"
            onClick={handleCreateGroup}
          />
        </div>

        <div className="desktop:max-h-[880px] flex flex-col overflow-y-auto">
          {groups.map((group) => (
            <GroupListItem
              key={group.id}
              group={group}
              selectedGroupId={selectedGroupId}
              handleSelectGroup={handleSelectGroup}
              dispatch={dispatch}
            />
          ))}
        </div>
      </div>
    </>
  );
};
