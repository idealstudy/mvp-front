import { CommonResponse, PaginationMeta, apiClient } from '@/lib/api';
import { Pageable } from '@/lib/api';

import { StudyNote, StudyNoteGroup } from '../type';

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

export const deleteStudyNoteGroup = async (args: { studyNoteId: number }) => {
  const response = await apiClient.delete(
    `/teacher/teaching-notes/${args.studyNoteId}/teaching-note-groups`
  );
  return response.data;
};

export const moveStudyNoteToGroup = async (args: {
  studyNoteId: number;
  groupId: number | null;
  studyRoomId: number;
}) => {
  const response = await apiClient.put(
    `/teacher/study-rooms/${args.studyRoomId}/teaching-notes/${args.studyNoteId}/group`,
    {
      groupId: args.groupId,
    }
  );
  return response.data;
};
