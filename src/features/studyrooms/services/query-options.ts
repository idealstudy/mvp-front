import { Pageable, PaginationMeta } from '@/lib/api';
import { infiniteQueryOptions } from '@tanstack/react-query';

import type { StudyNoteGroup } from '../types';
import { getStudyNoteGroup } from './api';

export const StudyRoomsGroupQueryKey = {
  all: ['studyNoteGroups'],
};

export const getStudyNoteGroupInfiniteOption = (args: {
  studyRoomId: number;
  pageable: Pageable;
}) => {
  return infiniteQueryOptions({
    queryKey: [StudyRoomsGroupQueryKey.all, args],
    queryFn: ({ pageParam = 0 }) =>
      getStudyNoteGroup({
        ...args,
        pageable: { ...args.pageable, page: pageParam },
      }),
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: PaginationMeta & { content: StudyNoteGroup[] }
    ) => {
      if (lastPage.pageNumber >= lastPage.totalPages - 1) return undefined;
      return lastPage.pageNumber + 1;
    },
  });
};
