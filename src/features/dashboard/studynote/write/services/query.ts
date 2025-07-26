import { useQuery } from '@tanstack/react-query';

import { getConnectMembersOption, getStudyRoomsOption } from './query-options';

// 임시로 작성된 스터디 룸 Query
export const useStudyRoomsQuery = () => {
  return useQuery(getStudyRoomsOption());
};

export const useConnectMembers = (roomId: number) => {
  return useQuery(getConnectMembersOption(roomId));
};
