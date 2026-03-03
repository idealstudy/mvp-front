/* ─────────────────────────────────────────────────────
 * 도메인
 * ────────────────────────────────────────────────────*/
export type {
  Room,
  RoomList,
  TeacherRoom,
  TeacherRoomList,
  TeacherRoomDetail,
  StudentRoom,
  StudentRoomList,
  StudentRoomDetail,
  RoomsDomain,
} from './room.types';

/* ─────────────────────────────────────────────────────
 * 공통 타입
 * ────────────────────────────────────────────────────*/
export type {
  RoomDTO,
  RoomVisibilityDTO,
  RoomModalityDTO,
  RoomClassFormDTO,
  RoomSchoolLevelDTO,
  RoomSubjectDTO,
  InvitationInfoDTO,
} from './room.types';

/* ─────────────────────────────────────────────────────
 * 역할별 타입(선생님, 학생)
 * ────────────────────────────────────────────────────*/
export type {
  TeacherRoomListItemDTO,
  TeacherRoomDetailDTO,
  TeacherRoomCUReqDTO,
  TeacherRoomCUDResDTO,
  StudentRoomListItemDTO,
  RoomMemberPageDTO,
  InvitationTokenDTO,
  StudyRoomInviteRespondDTO,
} from './room.types';
