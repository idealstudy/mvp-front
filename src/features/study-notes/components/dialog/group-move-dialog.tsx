'use client';

import { useState } from 'react';

import {
  useMoveNoteToGroup,
  useRemoveNoteFromGroup,
} from '@/features/study-notes/hooks';
import { StudyNoteGroupPageable } from '@/features/study-notes/model';
import { getStudyNoteGroupInfiniteOption } from '@/features/study-rooms';
import { Select } from '@/features/study-rooms/components/common/select';
import { DialogAction } from '@/shared/components/dialog';
import { Button } from '@/shared/components/ui/button';
import { Dialog } from '@/shared/components/ui/dialog';
import { useInfiniteScroll } from '@/shared/hooks/use-infinite-scroll';
import { useRole } from '@/shared/hooks/use-role';
import { useInfiniteQuery } from '@tanstack/react-query';

export const GROUP_MOVE_DIALOG_PAGEABLE = {
  page: 0,
  size: 10,
  sort: ['desc'],
};

export const GroupMoveDialog = ({
  open,
  dispatch,
  studyRoomId,
  studyNoteId,
  pageable,
  keyword,
  onRefresh,
}: {
  open: boolean;
  dispatch: (action: DialogAction) => void;
  studyRoomId: number;
  studyNoteId: number;
  pageable: StudyNoteGroupPageable;
  keyword: string;
  onRefresh: () => void;
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>('all');
  const { role } = useRole();

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
      pageable: GROUP_MOVE_DIALOG_PAGEABLE,
    }),
  });

  const { scrollContainerRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const { mutate: removeNoteMutation } = useRemoveNoteFromGroup();
  const { mutate: moveNoteMutation } = useMoveNoteToGroup();

  const handleSave = () => {
    const mutationArgs = {
      studyNoteId: studyNoteId,
      studyRoomId: studyRoomId,
      keyword: keyword,
      pageable: {
        page: pageable.page,
        size: pageable.size,
        sortKey: pageable.sortKey,
      },
    };

    const onSuccess = () => {
      onRefresh();
      dispatch({ type: 'CLOSE' });
    };

    if (
      selectedGroup === null ||
      selectedGroup === 'none' ||
      selectedGroup === 'all'
    ) {
      removeNoteMutation({ ...mutationArgs, groupId: null }, { onSuccess });
    } else {
      moveNoteMutation(
        { ...mutationArgs, groupId: Number(selectedGroup) },
        { onSuccess }
      );
    }
  };

  if (isPending) {
    return (
      <div className="p-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <p>Error</p>
      </div>
    );
  }

  const allGroups = [
    { id: 'all', title: '전체 보기' },
    ...studyNoteGroups.pages.flatMap((page) => page.content),
  ];

  return (
    <Dialog
      isOpen={open}
      onOpenChange={() => dispatch({ type: 'CLOSE' })}
    >
      <Dialog.Content className="w-[598px]">
        <Dialog.Header>
          <Dialog.Title>그룹 이동하기</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="mt-6">
          <Dialog.Description className="font-headline2-heading mb-1">
            이동할 그룹
          </Dialog.Description>
          <div className="max-h-60 overflow-y-auto">
            <Select
              value={selectedGroup ?? ''}
              onValueChange={(value) => setSelectedGroup(value)}
            >
              <Select.Trigger
                className="w-full px-6"
                data-position="right-6 text-black"
                placeholder="그룹을 선택하세요"
              />
              <Select.Content
                className="max-h-60"
                position="popper"
              >
                <div
                  className="flex max-h-40 flex-col gap-2 overflow-y-auto"
                  ref={scrollContainerRef}
                >
                  {allGroups.map((item) => (
                    <Select.Option
                      key={item.id}
                      value={item.id.toString()}
                    >
                      {item.title}
                    </Select.Option>
                  ))}
                </div>
              </Select.Content>
            </Select>

            {isFetchingNextPage && (
              <div className="mt-4 text-center text-sm text-gray-500">
                로딩 중...
              </div>
            )}
          </div>
        </Dialog.Body>
        <Dialog.Footer className="mt-6 justify-end">
          <Dialog.Close asChild>
            <Button
              variant="outlined"
              className="w-[120px]"
              size="xsmall"
              onClick={() => dispatch({ type: 'CLOSE' })}
            >
              취소
            </Button>
          </Dialog.Close>
          <Button
            className="w-[120px]"
            size="xsmall"
            onClick={handleSave}
          >
            저장
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
