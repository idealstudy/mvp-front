// 스터디룸 (목록)
export const StudyRoomsQueryKey = {
  all: ['studyRooms'] as const,
  teacherList: ['studyRooms', 'teacherList'] as const,
  studentList: ['studyRooms', 'studentList'] as const,
  detail: (id: number) => ['studyRooms', 'detail', id] as const, // 상세지만 계층구조를 위해 studyRooms 으로 유지 (성진)
  teacherDetail: (id: number) =>
    ['studyRooms', 'detail', id, 'teacher'] as const,
  studentDetail: (id: number) =>
    ['studyRooms', 'detail', id, 'student'] as const,
};

// 초대 토큰
export const InvitationTokenQueryKey = {
  detail: (studyRoomId: number) =>
    ['studyRooms', 'invitationToken', studyRoomId] as const,
};

// 학생 초대
export const InvitationQueryKey = {
  all: ['invitations'] as const,
  search: (studyRoomId: number, keyword: string) =>
    ['invitations', 'search', studyRoomId, keyword] as const,
};
