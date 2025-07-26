import { apiClient } from '@/lib/api';

import { CommonResponse, ConnectedMember, StudyRoom } from '../type';

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
        members: ConnectedMember[];
        pageNumber: number;
        size: number;
        totalElements: number;
        totalPages: number;
      }>
    >(`/teacher/study-rooms/${roomId}/members`)
  ).data;

  return response.data.members;
};
