import { Invitee } from '@/features/study-rooms/hooks/useInvitationController';
import type {
  MemberInvitation,
  SearchInvitationPayload,
  StudentStudyRoom,
  StudyNoteGroup,
  StudyRoom,
  StudyRoomClient,
  StudyRoomDetail,
  StudyRoomSubmitValues,
} from '@/features/study-rooms/model';
import { api } from '@/shared/api';
import { Pageable, PaginationData } from '@/types/http';

type GroupListResponse = PaginationData<StudyNoteGroup>;
type GroupApiArgs = { studyRoomId: number; pageable: Pageable };
// TODO: 임시 초대 수락 응답 타입
export type InvitationAcceptResponse = unknown;

export interface TeacherStudyRoomRequests {
  getStudyRooms(): Promise<StudyRoom[]>;
  getStudyRoomDetail(studyRoomId: number): Promise<StudyRoomDetail>;
  create(payload: StudyRoomSubmitValues): Promise<StudyRoom>;
  invitations: {
    send(args: {
      studyRoomId: number;
      emails: string[];
    }): Promise<MemberInvitation>;
    search(args: SearchInvitationPayload): Promise<Invitee[]>;
  };
  getStudyNoteGroup(args: GroupApiArgs): Promise<GroupListResponse>;
}

export interface StudentStudyRoomRequests {
  getStudyRooms(): Promise<StudentStudyRoom[]>;
  getStudyRoomDetail(studyRoomId: number): Promise<StudyRoomDetail>;
  getStudentStudyNoteGroup(args: GroupApiArgs): Promise<GroupListResponse>;
  acceptInvitation(
    invitationId: number | string
  ): Promise<InvitationAcceptResponse>;
}

export interface StudyRoomRequests {
  getTeacherStudyRooms(): Promise<StudyRoom[]>;
  getStudentStudyRooms(): Promise<StudentStudyRoom[]>;

  // Teacher
  create(payload: StudyRoomSubmitValues): Promise<StudyRoom>;
  invitations: {
    send(args: {
      studyRoomId: number;
      emails: string[];
    }): Promise<MemberInvitation>;
    search(args: SearchInvitationPayload): Promise<Invitee[]>;
  };
  getStudyNoteGroup(args: GroupApiArgs): Promise<GroupListResponse>;

  // Student
  acceptInvitation(
    invitationId: number | string
  ): Promise<InvitationAcceptResponse>;
}

export const createStudyRoomBaseApi = (
  client: StudyRoomClient = api.private
) => ({
  client,
  teacherBasePath: '/teacher/study-rooms',
  studentBasePath: '/student/study-rooms',
  studentInvitationPath: '/student/study-invites',
});
