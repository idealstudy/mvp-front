import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 선생님 통계 조회 DTO
 * ──────────────────────────────────────────────────── */
const TeacherReportDtoSchema = z.object({
  studyRoomCount: z.number(),
  teachingNoteCount: z.number(),
  studentCount: z.number(),
  qnaCount: z.number(),
  reviewCount: z.number(),
});

/* ─────────────────────────────────────────────────────
 * 선생님 수업 노트 전체 목록 조회 DTO
 * ────────────────────────────────────────────────────*/
const TeacherNoteListItemDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  studyRoomId: z.number(),
  studyRoomName: z.string(),
  qnaCount: z.number(),
  viewCount: z.number(),
  modDate: z.string(),
  representative: z.boolean(),
});

const TeacherNoteListDtoSchema = z.array(TeacherNoteListItemDtoSchema);

/* ─────────────────────────────────────────────────────
 * 선생님 스터디룸 전체 목록 조회 응답 DTO
 * ────────────────────────────────────────────────────*/
const TeacherStudyRoomListItemDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  teachingNoteCount: z.number(),
  studentCount: z.number(),
  qnaCount: z.number(),
});

const TeacherStudyRoomListDtoSchema = z.array(
  TeacherStudyRoomListItemDtoSchema
);

/* ─────────────────────────────────────────────────────
 * 선생님 기본 정보 DTO
 * ────────────────────────────────────────────────────*/
const BasicInfoDtoSchema = z.object({
  name: z.string(),
  email: z.string(),
  isProfilePublic: z.boolean(),
  simpleIntroduction: z.string(),
});

/* ─────────────────────────────────────────────────────
 * 선생님 기본 정보 Payload
 * ────────────────────────────────────────────────────*/
const UpdateBasicInfoPayloadSchema = z.object({
  name: z.string(),
  isProfilePublic: z.boolean(),
  simpleIntroduction: z.string(),
});

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const dto = {
  basicInfo: BasicInfoDtoSchema,
  teacherReport: TeacherReportDtoSchema,
  teacherNoteList: TeacherNoteListDtoSchema,
  teacherStudyRoomList: TeacherStudyRoomListDtoSchema,
};

export const payload = {
  updateBasicInfo: UpdateBasicInfoPayloadSchema,
};
