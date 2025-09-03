import { useReducer } from 'react';

import Image from 'next/image';

import {
  dialogReducer,
  initialDialogState,
} from '@/features/studyrooms/hooks/useDialogReducer';
import { getStudyNoteGroupInfiniteOption } from '@/features/studyrooms/services/query-options';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { useInfiniteQuery } from '@tanstack/react-query';

import { StudyroomGroupDialogs } from './dialogs.tsx';
import { GroupListItem } from './llist-item';

export const STUDYROOM_SIDEBAR_GROUPS_PAGEABLE = {
  page: 0,
  size: 20,
  sort: ['id'],
};

export const StudyroomGroups = ({
  studyRoomId,
  selectedGroupId,
  handleSelectGroupId,
}: {
  studyRoomId: number;
  selectedGroupId: number | string;
  handleSelectGroupId: (id: number | string) => void;
}) => {
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);

  const {
    data: studyNoteGroups,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...getStudyNoteGroupInfiniteOption({
      studyRoomId: studyRoomId,
      pageable: STUDYROOM_SIDEBAR_GROUPS_PAGEABLE,
    }),
  });

  const { scrollContainerRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const handleCreateGroupClick = () => {
    dispatch({
      type: 'OPEN',
      scope: 'group',
      kind: 'create',
      payload: { groupId: undefined, title: '' },
    });
  };

  const allGroups = [
    { id: 'all', title: '전체 보기' },
    ...(studyNoteGroups?.pages.flatMap((page) => page.content) || []),
  ];

  return (
    <>
      <StudyroomGroupDialogs
        dialog={dialog}
        dispatch={dispatch}
        studyRoomId={studyRoomId}
        selectedGroupId={Number(selectedGroupId)}
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
            onClick={handleCreateGroupClick}
          />
        </div>

        <div
          ref={scrollContainerRef}
          className="desktop:max-h-[1000px] flex flex-col overflow-y-auto"
        >
          {allGroups.map((group) => (
            <GroupListItem
              key={group.id}
              group={group}
              selectedGroupId={selectedGroupId}
              handleSelectGroup={handleSelectGroupId}
              dispatch={dispatch}
            />
          ))}
        </div>
      </div>
    </>
  );
};
