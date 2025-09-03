import { CommonResponse, PaginationMeta, apiClient } from '@/lib/api';
import { Pageable } from '@/lib/api';

import type {
  StudyNote,
  StudyNoteGroup,
  StudyNoteGroupPageable,
} from '../type';

export const getStudyNotes = async (args: {
  studyRoomId: number;
  pageable: StudyNoteGroupPageable;
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

export const updateStudyNoteGroup = async (args: {
  teachingNoteId: number;
  teachingNoteGroupId: number;
}) => {
  const response = await apiClient.put(
    `/teacher/teaching-notes/${args.teachingNoteId}/teaching-note-groups`,
    {
      teachingNoteGroupId: args.teachingNoteGroupId,
    }
  );
  return response.data;
};

export const getStudyNoteDetail = async (args: { teachingNoteId: number }) => {
  const response = await apiClient.get(
    `/public/teaching-notes/${args.teachingNoteId}`
  );
  return response.data;
};

export const updateStudyNote = async (args: {
  teachingNoteId: number;
  studyRoomId: number;
  teachingNoteGroupId: number;
  title: string;
  content: string;
  visibility: string;
  taughtAt: string;
  studentIds: number[];
}) => {
  const response = await apiClient.put(
    `/teacher/teaching-notes/${args.teachingNoteId}`,
    {
      studyRoomId: args.studyRoomId,
      teachingNoteGroupId: args.teachingNoteGroupId,
      title: args.title,
      content: args.content,
      visibility: args.visibility,
      taughtAt: args.taughtAt,
      studentIds: args.studentIds,
    }
  );
  return response.data;
};
