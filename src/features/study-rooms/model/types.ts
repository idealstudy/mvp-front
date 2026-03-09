import { api } from '@/shared/api';

export type ApiResponse<T> = { status: number; message: string; data: T };

export type Role =
  | 'ROLE_ADMIN'
  | 'ROLE_STUDENT'
  | 'ROLE_TEACHER'
  | 'ROLE_PARENT';

export interface StudyNoteGroup {
  id: number;
  title: string;
}

export interface CreateStepForm {
  onNext: () => void;
  disabled: boolean;
}

export type StudyRoom = {
  id: number;
  name: string;
  description: string;
  teacherName: string;
  visibility: 'PUBLIC' | 'PRIVATE';
};

// TODO: 특징 변수 맞추기
export type StudyRoomDetail = {
  id: number;
  name: string;
  description: string;
  characteristic: string;
  resolvedContent?: {
    content?: string | null;
    expiresAt?: string | null;
  } | null;
  teacherId: number;
  teacherName: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  modality: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  classForm: 'ONE_ON_ONE' | 'GROUP';
  subjectType: string;
  schoolInfo: {
    schoolLevel: string;
    grade: number;
  };
  numberOfTeachingNote: number;
  studentNames: string[];
  numberOfQuestion: number;
};

export type StudentStudyRoom = {
  id: number;
  name: string;
  description: string;
  teacherId: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  numberOfTeachingNotes: number;
};

// 스터디룸 사용자(학생)초대
export type Invitation = {
  role: string;
  canInvite: boolean;
  inviteeId: number;
  inviteeEmail: string;
  inviteeName: string;
  connectedGuardianCount: number;
  connectedStudentCount: number;
  studentResponseList: string[];
};

export type InviteSuccess = {
  email: string;
  name: string;
  role: Role;
};

export type InviteFailure = {
  email: string;
  name: string;
  reason: string;
};

export type MemberInvitation = {
  successEmailList: InviteSuccess[];
  failEmailList: InviteFailure[];
};

export interface StudyRoomClient {
  get: typeof api.private.get;
  post: typeof api.private.post;
  delete: typeof api.private.delete;
}

export interface InvitationPayload {
  studyRoomId: number;
  emails: string[];
}

export interface SearchInvitationPayload {
  studyRoomId: number;
  keyword: string;
}

export interface DeleteStudyRoomPayload {
  studyRoomId: number;
}
