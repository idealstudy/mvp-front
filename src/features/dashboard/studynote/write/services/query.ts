import { useMutation, useQuery } from '@tanstack/react-query';

import { StudyNote } from '../type';
import { writeStudyNote } from './api';
import {
  getConnectMembersOption,
  getStudyNodeGroupsOption,
  getStudyRoomsOption,
} from './query-options';

export const useConnectMembers = (roomId: number) => {
  return useQuery(getConnectMembersOption(roomId));
};

export const useStudyNoteGroupsQuery = () => {
  return useQuery(getStudyNodeGroupsOption());
};

export const useWriteStudyNoteMutation = () => {
  return useMutation({
    mutationFn: (data: StudyNote) => writeStudyNote(data),
  });
};

// export const useStudyNoteListByStudyRoomQuery = ({
//   roomId,
//   pageble,
// }: {
//   roomId: number;
//   pageble: Pageable;
// }) => {
//   return useQuery(getStudyNoteListByStudyRoomOption({ roomId, pageble }));
// };

// 임시로 작성된 스터디 룸 Query
export const useStudyRoomsQuery = () => {
  return useQuery(getStudyRoomsOption());
};
