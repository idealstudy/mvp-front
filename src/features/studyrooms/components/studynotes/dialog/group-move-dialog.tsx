'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Select } from '@/features/studyrooms/components/common/select';
import { DialogAction } from '@/features/studyrooms/hooks/useDialogReducer';
import { getStudyNoteGroupInfiniteOption } from '@/features/studyrooms/services/query-options';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { useInfiniteQuery } from '@tanstack/react-query';

import {
  useDeleteStudyNoteToGroup,
  useUpdateStudyNoteToGroup,
} from '../services/query';
import type { StudyNoteGroupPageable } from '../type';

const PAGE_SIZE = 10;

export const GroupMoveDialog = ({
  open,
  dispatch,
  studyRoomId,
  studyNoteId,
  pageable,
  keyword,
}: {
  open: boolean;
  dispatch: (action: DialogAction) => void;
  studyRoomId: number;
  studyNoteId: number;
  pageable: StudyNoteGroupPageable;
  keyword: string;
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>('none');

  const {
    data: studyNoteGroups,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...getStudyNoteGroupInfiniteOption({
      studyRoomId: studyRoomId,
      pageable: { ...pageable, size: PAGE_SIZE, sort: ['id'] },
    }),
  });

  const { scrollContainerRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const { mutate: removeStudyNoteGroup } = useDeleteStudyNoteToGroup({
    studyNoteId: studyNoteId,
    studyRoomId,
    pageable,
    keyword,
  });

  const { mutate: updateStudyNoteGroup } = useUpdateStudyNoteToGroup({
    teachingNoteId: studyNoteId,
    teachingNoteGroupId: Number(selectedGroup),
    studyRoomId,
    pageable,
    keyword,
  });

  const handleSave = () => {
    if (selectedGroup === null || selectedGroup === 'none') {
      removeStudyNoteGroup();
    } else {
      updateStudyNoteGroup();
    }
    dispatch({ type: 'CLOSE' });
  };

  const allGroups = [
    { id: 'none', title: '없음' },
    ...(studyNoteGroups?.pages.flatMap((page) => page.content) || []),
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
          <div
            ref={scrollContainerRef}
            className="max-h-60 overflow-y-auto"
          >
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
                <div className="max-h-40 overflow-y-auto">
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
              size="small"
              onClick={() => dispatch({ type: 'CLOSE' })}
            >
              취소
            </Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button
              className="w-[120px]"
              size="small"
              onClick={handleSave}
            >
              저장
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
