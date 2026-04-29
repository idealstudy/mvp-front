// 스터디룸 (목록)
export const studyRoomsQueryKey = {
  all: ['studyRooms'] as const,
  teacherList: ['studyRooms', 'teacherList'] as const,
  studentList: ['studyRooms', 'studentList'] as const,
  detail: (id: number) => ['studyRooms', 'detail', id] as const,
  teacherDetail: (id: number) =>
    ['studyRooms', 'detail', id, 'teacher'] as const,
  studentDetail: (id: number) =>
    ['studyRooms', 'detail', id, 'student'] as const,
};

// 학생 초대
export const InvitationQueryKey = {
  all: ['invitations'] as const,
  search: (studyRoomId: number, email: string) =>
    ['invitations', 'search', studyRoomId, email] as const,
};
