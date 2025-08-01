import { queryOptions } from '@tanstack/react-query';

import { getConnectMembers, getStudyRooms } from './api';

export const StudyNoteQueryKey = {
  all: ['studyNote'],
  // 임시로 작성
  rooms: () => [...StudyNoteQueryKey.all, 'rooms'],
  students: (roomId: number) => [...StudyNoteQueryKey.all, 'students', roomId],
};

// 임시로 작성
export const getStudyRoomsOption = () => {
  return queryOptions({
    queryKey: StudyNoteQueryKey.rooms(),
    queryFn: () => getStudyRooms(),
  });
};

export const getConnectMembersOption = (roomId: number) => {
  return queryOptions({
    queryKey: StudyNoteQueryKey.students(roomId),
    queryFn: () => getConnectMembers(roomId),
    select(data) {
      const flatMembers = data.members.flatMap(
        ({ studentInfo, parentInfo }) => [studentInfo, parentInfo]
      );
      return flatMembers;
    },
    enabled: !!roomId,
  });
};
