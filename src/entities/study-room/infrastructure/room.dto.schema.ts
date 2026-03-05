import { member } from '@/entities/member';
import { z } from 'zod';

import { base } from './room.base.schema';

/* ─────────────────────────────────────────────────────
 * 공용
 * ────────────────────────────────────────────────────*/
const RoomStatsSchema = z.object({
  numberOfTeachingNote: z.number().int(),
});

const RoomStudentNamesSchema = z.object({
  studentNames: z.array(z.string()),
});

const InvitationInfoSchema = z.object({
  studyRoomName: z.string(),
  teacherName: z.string(),
  message: z.string(),
});

/* ─────────────────────────────────────────────────────
 * 선생님 - 목록 응답 아이템 (GET /api/teacher/study-rooms)
 * ────────────────────────────────────────────────────*/
const TeacherRoomListItemSchema = base.schema
  .merge(RoomStatsSchema)
  .merge(RoomStudentNamesSchema);

/* ─────────────────────────────────────────────────────
 * 선생님 - 상세 (GET /api/teacher/study-rooms/{id})
 * ────────────────────────────────────────────────────*/
const TeacherRoomDetailSchema = TeacherRoomListItemSchema.extend({
  teacherName: z.string(),
  modality: base.modality,
  classForm: base.classForm,
  subjectType: base.subject,
  schoolInfo: base.schoolInfo,
  numberOfQuestion: z.number().int(),
});

/* ─────────────────────────────────────────────────────
 * 선생님 - 생성/수정 요청 바디 (POST/PUT /api/teacher/study-rooms)
 * ────────────────────────────────────────────────────*/
const TeacherRoomCURequestSchema = z.object({
  name: z.string(),
  description: z.string(),
  modality: base.modality,
  classForm: base.classForm,
  subjectType: base.subject,
  schoolInfo: base.schoolInfo,
  visibility: base.visibility,
});

// 생성/수정 응답 예시
const TeacherRoomCUDResponseDataSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  teacherName: z.string(),
  visibility: base.visibility,
});

/* ─────────────────────────────────────────────────────
 * 선생님 - 멤버 목록 (GET /api/teacher/study-rooms/{id}/members)
 * ────────────────────────────────────────────────────*/
const RoomMemberItemSchema = z.object({
  studentInfo: z.object({
    role: member.dto.role,
    id: z.number().int(),
    name: z.string(),
    email: z.string(),
    joinDate: z.string(),
  }),
  parentInfo: z.object({
    role: member.domain.role,
    id: z.number().int(),
    name: z.string(),
    email: z.string(),
    joinDate: z.string(),
  }),
});

const RoomMemberPageSchema = z.object({
  pageNumber: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  members: z.array(RoomMemberItemSchema),
});

/* ─────────────────────────────────────────────────────
 * 선생님 - 멤버 초대 (POST /api/teacher/study-rooms/{id}/members)
 * ────────────────────────────────────────────────────*/
const InviteSuccessItemSchema = z.object({
  email: z.string(),
  name: z.string(),
  role: member.domain.role,
});

/* ─────────────────────────────────────────────────────
 * 선생님 - 초대 토큰 조회 및 토글 (GET, PUT /api/teacher/study-rooms/{id}/invitation)
 * ────────────────────────────────────────────────────*/
const InviteTokenDataSchema = z.object({
  enabled: z.boolean(),
  token: z.string().nullable(),
});

const InviteFailItemSchema = z.object({
  email: z.string(),
  name: z.string(),
  reason: z.string(),
});

/* ─────────────────────────────────────────────────────
 * 학생 - 스터디룸 목록
 * ────────────────────────────────────────────────────*/
const StudentRoomListItemSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  teacherId: z.number().int(),
  visibility: base.visibility,
  numberOfTeachingNote: z.number().int(),
});

/* ─────────────────────────────────────────────────────
 * 학생 - 초대 응답
 * ────────────────────────────────────────────────────*/
const StudyRoomInviteRespondDataSchema = z.object({
  state: z
    .enum(['PENDING', 'APPROVED', 'REJECTED', 'TERMINATED'])
    .catch('PENDING'),
  studyRoomResponse: z.object({
    id: z.number().int(),
    name: z.string(),
    description: z.string(),
    teacherName: z.string(),
    visibility: base.visibility,
  }),
});

/* ─────────────────────────────────────────────────────
 * 선생님 - 초대 대상 검색
 * ────────────────────────────────────────────────────*/
const StudyRoomSearchInviteeDataSchema = z.object({
  role: z.string(),
  canInvite: z.boolean(),
  inviteeId: z.number().int(),
  inviteeEmail: z.string(),
  inviteeName: z.string(),
  connectedGuardianCount: z.number().int(),
  connectedStudentCount: z.number().int(),
  studentResponseList: z.array(z.string()),
});

/* ─────────────────────────────────────────────────────
 * DTO 내보내기
 * ────────────────────────────────────────────────────*/
const teacher = {
  listItem: TeacherRoomListItemSchema,
  detail: TeacherRoomDetailSchema,
  cuRequest: TeacherRoomCURequestSchema,
  cuResponse: TeacherRoomCUDResponseDataSchema,
  memberPage: RoomMemberPageSchema,
  inviteSuccess: InviteSuccessItemSchema,
  inviteFail: InviteFailItemSchema,
  inviteToken: InviteTokenDataSchema,
};

const student = {
  listItem: StudentRoomListItemSchema,
  inviteRespond: StudyRoomInviteRespondDataSchema,
};

const search = {
  invitee: StudyRoomSearchInviteeDataSchema,
};

export const dto = {
  teacher,
  student,
  search,
  states: RoomStatsSchema,
  studentNames: RoomStudentNamesSchema,
  invitationInfo: InvitationInfoSchema,
};
