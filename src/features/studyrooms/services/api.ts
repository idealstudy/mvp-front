import { StudyRoomFormValues } from '@/features/studyrooms/schemas/create';
import { CommonResponse, PaginationMeta, api, apiClient } from '@/lib/api';
import { Pageable } from '@/lib/api';

import type { ApiResponse, StudyNoteGroup, StudyRoom } from '../types';

// 수업노트 그룹 조회
export const getStudyNoteGroup = async (args: {
  studyRoomId: number;
  pageable: Pageable;
}) => {
  const response = (
    await apiClient.get<
      CommonResponse<PaginationMeta & { content: StudyNoteGroup[] }>
    >(`/teacher/study-rooms/${args.studyRoomId}/teaching-note-groups`, {
      params: {
        page: args.pageable.page,
        size: args.pageable.size,
        sort: args.pageable.sort,
      },
      paramsSerializer: {
        indexes: null,
      },
    })
  ).data;
  return response.data;
};

export const studyroomApi = {
  create: async (payload: StudyRoomFormValues): Promise<StudyRoom> => {
    const response = await api.post<ApiResponse<StudyRoom>>(
      '/teacher/study-rooms',
      payload
    );
    return response.data;
  },
};
