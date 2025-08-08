import { Role } from '@/features/auth/type';
import { Sort } from '@/lib/api';

export interface StudyNote {
  studyRoomId: number;
  title: string;
  content: string;
  visibility: string;
  taughtAt: string;
  studentIds: number[];
}

export interface ConnectedMember {
  role: Role;
  id: number;
  name: string;
  email: string;
  joinDate: string | null;
}

// 스터디 노트 그룹

export interface Teacher {
  id: number;
  email: string;
  password: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  birthDate: string;
  acceptOptionalTerm: boolean;
  role: Role;
  regDate: string;
  modDate: string;
}

export interface StudyRoom {
  id: number;
  name: string;
  description: string;
  teacher: Teacher;
  capacity: number;
  visibility: string;
  startDate: string;
  endDate: string;
  regDate: string;
  modDate: string;
}

export interface TempStudyNote {
  id: number;
  studyRoom: StudyRoom;
  group: string;
  title: string;
  content: string;
  visibility: string;
  viewCount: number;
  taughtAt: string;
  regDate: string;
  modDate: string;
}

interface StudyNoteGroup {
  id: number;
  title: string;
  regDate: string;
  modDate: string;
  teacherId: number;
  teachingNotes: TempStudyNote[];
}

export interface StudyNoteGroupResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  sort: Sort;
  pageable: {
    offset: number;
    sort: Sort;
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
  };
  first: boolean;
  last: boolean;
  empty: boolean;
  content: StudyNoteGroup[];
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
