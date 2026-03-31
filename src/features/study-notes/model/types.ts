export interface StudentInfo {
  studentId: number;
  studentName: string;
  readAt: string;
}

export interface StudyNote {
  id: number;
  groupId: number | null;
  groupName: string;
  teacherName: string;
  title: string;
  visibility: string;
  taughtAt: string;
  updatedAt: string;
}

export interface StudyNoteDetails extends StudyNote {
  content: string;
  studentInfos: StudentInfo[];
}

export type StudyNoteSortKey =
  | 'LATEST_EDITED'
  | 'OLDEST_EDITED'
  | 'TITLE_ASC'
  | 'TAUGHT_AT_ASC';

export type StudyNoteLimit = 20 | 30;

export interface StudyNoteGroupPageable {
  page: number;
  size: number;
  sortKey: string;
}

export interface StudyNotesPageable {
  sortKey: StudyNoteSortKey;
  limit: StudyNoteLimit;
  page: number;
}

export interface MemberInfo {
  role: 'ROLE_ADMIN' | 'ROLE_STUDENT' | 'ROLE_TEACHER' | 'ROLE_PARENT';
  id: number;
  name: string;
  email: string;
  joinDate: string;
  outDate: string | null;
  consultationCount?: number;
  state?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'TERMINATED';
}

export interface StudyMember {
  studentInfo: MemberInfo;
  parentInfo?: MemberInfo;
}

export interface StudyNoteMemberResponse {
  status: number;
  message: string;
  data: {
    pageNumber: number;
    size: number;
    totalElements: number;
    totalPages: number;
    members: StudyMember[];
  };
}

export interface StudyNoteMember {
  id: string;
  name: string;
  email: string;
  role: 'ROLE_STUDENT' | 'ROLE_PARENT';
  dday: number;
  guardianCount?: number;
  joinText: string;
  outText: string | null;
  avatarSrc?: string;
  consultationCount: number;
  isTerminated: boolean;
}

export type ListArgs = {
  studyRoomId: number;
  pageable: StudyNoteGroupPageable;
  enabled?: boolean;
  keyword?: string;
};

export type ByGroupArgs = {
  studyRoomId: number;
  teachingNoteGroupId: number;
  pageable: StudyNoteGroupPageable;
  enabled?: boolean;
  keyword?: string;
};
