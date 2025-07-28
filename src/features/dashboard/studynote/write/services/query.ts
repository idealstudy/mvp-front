import { useMutation, useQuery } from '@tanstack/react-query';

import { StudyNote } from '../type';
import { writeStudyNote } from './api';
import { getConnectMembersOption, getStudyRoomsOption } from './query-options';

export const useConnectMembers = (roomId: number) => {
  return useQuery(getConnectMembersOption(roomId));
};

export const useWriteStudyNoteMutation = () => {
  return useMutation({
    mutationFn: (data: StudyNote) => writeStudyNote(data),
  });
};

// 임시로 작성된 스터디 룸 Query
export const useStudyRoomsQuery = () => {
  return useQuery(getStudyRoomsOption());
};
