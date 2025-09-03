import { Pageable, PaginationMeta } from '@/lib/api';
import { infiniteQueryOptions } from '@tanstack/react-query';

import type { StudyNoteGroup } from '../components/types';
import { getStudyNoteGroup } from './api';

export const getStudyNoteGroupInfiniteOption = (args: {
  studyRoomId: number;
  pageable: Pageable;
}) => {
  return infiniteQueryOptions({
    queryKey: ['studyNoteGroupInfinite', args],
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
