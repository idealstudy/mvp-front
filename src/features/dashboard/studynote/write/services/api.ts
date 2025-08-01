import { CommonResponse, apiClient } from '@/lib/api';

import {
  ConnectedMember,
  StudyNote,
  StudyNoteGroupResponse,
  StudyRoom,
} from '../type';

export const getStudyRooms = async () => {
  const response = (
    await apiClient.get<CommonResponse<StudyRoom[]>>('/teacher/study-rooms')
  ).data;
  return response.data;
};

export const getConnectMembers = async (roomId: number) => {
  const response = (
    await apiClient.get<
      CommonResponse<{
        pageNumber: number;
        size: number;
        totalElements: number;
        totalPages: number;
        members: {
          studentInfo: ConnectedMember;
          parentInfo: ConnectedMember;
        }[];
      }>
    >(`/teacher/study-rooms/${roomId}/members`)
  ).data;

  return response.data;
};

export const writeStudyNote = async (data: StudyNote) => {
  await apiClient.post('/teacher/teaching-notes', data);
};

export const getStudyNoteGroups = async () => {
  const response = (
    await apiClient.get<CommonResponse<StudyNoteGroupResponse>>(
      `/teacher/teaching-note-groups`
    )
  ).data;

  return response.data;
};
