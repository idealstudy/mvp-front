import { z } from 'zod';

import { domain } from '../core/room.domain.schema';
import { base } from '../infrastructure/room.base.schema';
import { dto } from '../infrastructure/room.dto.schema';

/* ─────────────────────────────────────────────────────
 * DTO - 공통 타입
 * ────────────────────────────────────────────────────*/
export type RoomDTO = z.infer<typeof base.schema>;
export type RoomVisibilityDTO = z.infer<typeof base.visibility>;
export type RoomModalityDTO = z.infer<typeof base.modality>;
export type RoomClassFormDTO = z.infer<typeof base.classForm>;
export type RoomSchoolLevelDTO = z.infer<typeof base.schoolInfo>;
export type RoomSubjectDTO = z.infer<typeof base.subject>;
export type InvitationInfoDTO = z.infer<typeof dto.invitationInfo>;

/* ─────────────────────────────────────────────────────
 * DTO - 선생님 타입
 * ────────────────────────────────────────────────────*/
export type TeacherRoomListItemDTO = z.infer<typeof dto.teacher.listItem>;
export type TeacherRoomDetailDTO = z.infer<typeof dto.teacher.detail>;
export type TeacherRoomCUReqDTO = z.infer<typeof dto.teacher.cuRequest>;
export type TeacherRoomCUDResDTO = z.infer<typeof dto.teacher.cuResponse>;
export type RoomMemberPageDTO = z.infer<typeof dto.teacher.memberPage>;
export type InvitationTokenDTO = z.infer<typeof dto.teacher.inviteToken>;

/* ─────────────────────────────────────────────────────
 * DTO - 학생 타입
 * ────────────────────────────────────────────────────*/
export type StudentRoomListItemDTO = z.infer<typeof dto.student.listItem>;
export type StudyRoomInviteRespondDTO = z.infer<
  typeof dto.student.inviteRespond
>;

/* ─────────────────────────────────────────────────────
 * 도메인 타입 정의 (Domain Layer)
 * Room              : 스터디룸의 공통 도메인 객체 (teacher/student 공통 필드)
 * RoomList          : Room[] 리스트
 *
 * TeacherRoom       : 선생님용 스터디룸 도메인 객체
 * TeacherRoomList   : 선생님용 스터디룸 리스트(목록)
 * TeacherRoomDetail : 선생님 스터디룸 상세 도메인
 *
 * StudentRoom       : 학생용 스터디룸 도메인 객체
 * StudentRoomList   : 학생용 스터디룸 리스트(목록)
 * StudentRoomDetail : 학생 스터디룸 상세 도메인
 *
 * RoomsDomain       : Room 리스트의 총합 타입
 *                     (TeacherRoomList | StudentRoomList)
 *                     대시보드 등 역할 구분 없이 처리할 때 사용
 * ────────────────────────────────────────────────────*/
export type Room = z.infer<typeof domain.base>;
export type RoomList = Room[];
export type TeacherRoom = z.infer<typeof domain.teacher.list>;
export type TeacherRoomList = TeacherRoom[];
export type TeacherRoomDetail = z.infer<typeof domain.teacher.detail>;
export type StudentRoom = z.infer<typeof domain.student.list>;
export type StudentRoomList = StudentRoom[];
export type StudentRoomDetail = z.infer<typeof domain.student.detail>;
export type RoomsDomain = TeacherRoomList | StudentRoomList;
