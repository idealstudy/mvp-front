import { CommonResponse, PaginationMeta, apiClient } from '@/lib/api';

import { StudyNote } from '../type';

export const getStudyNotes = async (args: {
  studyRoomId: number;
  pageable: { page: number; size: number; sortKey: string };
  keyword: string;
}) => {
  const response = (
    await apiClient.get<
      CommonResponse<PaginationMeta & { content: StudyNote[] }>
    >(`/teacher/study-rooms/${args.studyRoomId}/teaching-notes`, {
      params: {
        page: args.pageable.page,
        size: args.pageable.size,
        sortKey: args.pageable.sortKey,
        // keyword: args.keyword,
      },
    })
  ).data;
  return response.data;
};
