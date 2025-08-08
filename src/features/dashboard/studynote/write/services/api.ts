import { CommonResponse, PaginationMeta, apiClient } from '@/lib/api';

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
      CommonResponse<
        PaginationMeta & {
          members: {
            studentInfo: ConnectedMember;
            parentInfo: ConnectedMember;
          }[];
        }
      >
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

// export const getStudyNotesByStudyRoomId = async ({
//   roomId,
//   pageble,
// }: {
//   roomId: number;
//   pageble: Pageable;
// }) => {
//   const response = (
//     await apiClient.get<
//       CommonResponse<PaginationMeta & { content: StudyNote[] }>
//     >(
//       `/teacher/study-rooms/${roomId}/teaching-notes?${objectToQueryString(pageble)}`
//     )
//   ).data;

//   return response.data;
// };
