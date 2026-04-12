// 공개 강사 프로필 타입
export interface PublicTeacherProfile {
  id: number;
  name: string;
  nickname?: string;
  profileImageUrl?: string;
  bio?: string;
  specialties?: string[]; // 과목, 학년 등
  experience?: string;
  rating?: number;
  reviewCount?: number;
  studyRoomCount: number;
  studentCount?: number;
  teachingNoteCount?: number;
  joinedAt: string;
  isNewTeacher?: boolean; // 신규 가입 여부 (예: 30일 이내)
  //   regDate: string; // 가입일
}

// 공개 스터디룸 타입 (기존 StudyRoom 확장)
export interface PublicStudyRoom {
  id: number;
  name: string;
  description: string;
  teacherId: number;
  teacherName: string;
  teacherProfileImageUrl?: string;
  studyRoomImageUrl?: string; // 스터디룸 이미지
  subjectType?: string;
  grade?: string;
  studentCount?: number;
  visibility?: 'PUBLIC' | 'PRIVATE';
  createdAt?: string;
}

// API 응답 타입
export interface PublicTeachersResponse {
  content: PublicTeacherProfile[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  size: number;
}

export interface PublicStudyRoomsResponse {
  content: PublicStudyRoom[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  size: number;
}
