import { Pageable, PaginationMeta } from '@/lib/api';
import { infiniteQueryOptions } from '@tanstack/react-query';

import type { StudyNoteGroup } from '../components/types';
import { getStudyNoteGroup } from './api';

export const StudyNoteGroupQueryKey = {
  all: ['studyNoteGroups'],
  studyNoteGroups: (args: { studyRoomId: number; pageable: Pageable }) => [
    ...StudyNoteGroupQueryKey.all,
    'studyNoteGroups',
    args.studyRoomId,
    args.pageable,
  ],
};

export const getStudyNoteGroupInfiniteOption = (args: {
  studyRoomId: number;
  pageable: Pageable;
}) => {
  return infiniteQueryOptions({
    queryKey: StudyNoteGroupQueryKey.studyNoteGroups(args),
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
