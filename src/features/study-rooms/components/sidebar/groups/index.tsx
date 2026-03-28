import { useReducer } from 'react';

import { Role } from '@/entities/member';
import { getStudyNoteGroupInfiniteOption } from '@/features/study-rooms';
import { dialogReducer, initialDialogState } from '@/shared/components/dialog';
import { PlusIcon } from '@/shared/components/icons';
import { useInfiniteScroll } from '@/shared/hooks/use-infinite-scroll';
import { useInfiniteQuery } from '@tanstack/react-query';

import { StudyroomGroupDialogs } from './dialogs';
import { GroupListItem } from './list-item';

export const STUDYROOM_SIDEBAR_GROUPS_PAGEABLE = {
  page: 0,
  size: 20,
  sort: ['desc'],
};

export const StudyroomGroups = ({
  role,
  studyRoomId,
  selectedGroupId,
  handleSelectGroupId,
}: {
  role: Role | undefined;
  studyRoomId: number;
  selectedGroupId: number | 'all';
  handleSelectGroupId: (id: number | 'all') => void;
}) => {
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);

  const {
    data: studyNoteGroups,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    ...getStudyNoteGroupInfiniteOption(role, {
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

  // 1) 로딩 화면: 반드시 return 해서 아래 로직이 실행되지 않게
  if (isPending) {
    return (
      <div className="p-4">
        <p>Loading...</p>
      </div>
    );
  }

  // 2) 에러 화면: 마찬가지로 return
  if (isError) {
    return (
      <div className="p-4">
        <p>Error</p>
      </div>
    );
  }

  const allGroups: Array<{ id: number | 'all'; title: string }> = [
    { id: 'all', title: '전체 보기' },
    ...studyNoteGroups.pages.flatMap((page) => page.content),
  ];

  return (
    <>
      <StudyroomGroupDialogs
        dialog={dialog}
        dispatch={dispatch}
        studyRoomId={studyRoomId}
        selectedGroupId={Number(selectedGroupId)}
        handleSelectGroupId={handleSelectGroupId}
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="font-body1-heading">수업노트 그룹</p>
          {role === 'ROLE_TEACHER' && (
            <div
              className="hover:bg-gray-scale-gray-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px]"
              onClick={handleCreateGroupClick}
            >
              <PlusIcon />
            </div>
          )}
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
