export type CommonResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export interface StudyNote {
  studyRoomId: number;
  title: string;
  content: string;
  visibility: string;
  taughtAt: string;
  studentIds: number[];
}

export interface ConnectedMember {
  role: 'ROLE_STUDENT' | 'ROLE_TEACHER' | 'ROLE_PARENT';
  id: number;
  name: string;
  email: string;
  joinDate: string | null;
}

// 임시로 작성
export interface StudyRoom {
  id: number;
  name: string;
  description: string;
  teacherId: number;
  visibility: string;
  numberOfTeachingNote: number;
  studentNames: string[];
  startDate: string;
  endDate: string;
}
