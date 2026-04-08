export type ParentStudentStudyRoom = {
  studyRoomId: number;
  studyRoomName: string;
};

export type ParentStudent = {
  studentId: number;
  studentName: string;
  studyRooms: ParentStudentStudyRoom[];
};
