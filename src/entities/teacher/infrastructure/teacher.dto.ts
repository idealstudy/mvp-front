import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 선생님 기본 정보 DTO
 * ────────────────────────────────────────────────────*/
const BasicInfoDtoSchema = z.object({
  name: z.string(),
  email: z.string(),
  isProfilePublic: z.boolean(),
  simpleIntroduction: z.string().nullable(),
});

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
 * 선생님 전체 수업 노트 목록 조회 DTO
 * ────────────────────────────────────────────────────*/
const TeacherNoteListItemDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  studyRoomId: z.number(),
  studyRoomName: z.string(),
  qnaCount: z.number(),
  viewCount: z.number(),
  modDate: z.string(),
  representative: z.boolean(),
});

const TeacherNoteListDtoSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(TeacherNoteListItemDtoSchema),
});

/* ─────────────────────────────────────────────────────
 * 선생님 대표 수업 노트 목록 조회 DTO
 * ────────────────────────────────────────────────────*/
const TeacherRepresentativeNoteListItemDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  studyRoomId: z.number(),
  studyRoomName: z.string(),
  qnaCount: z.number(),
  viewCount: z.number(),
  modDate: z.string(),
  representative: z.boolean(),
});

const TeacherRepresentativeNoteListDtoSchema = z.array(
  TeacherRepresentativeNoteListItemDtoSchema
);

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
 * 선생님 후기 전체 목록 조회 응답 DTO
 * ────────────────────────────────────────────────────*/
const TeacherReviewListItemDtoSchema = z.object({
  id: z.number(),
  srcMemberId: z.number(),
  srcMemberName: z.string(),
  dstMemberId: z.number(),
  dstMemberName: z.string(),
  studyRoomId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  contentPreview: z.string(),
  imageInfo: z.object({ imageUrls: z.string().array(), expiresAt: z.string() }),
  regDate: z.string(),
});

const TeacherReviewListDtoSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(TeacherReviewListItemDtoSchema),
});
/* ─────────────────────────────────────────────────────
 * 선생님 경력 전체 목록 조회 응답 DTO
 * ────────────────────────────────────────────────────*/
const TeacherCareerListItemDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  current: z.boolean().nullable(),
});

const TeacherCareerListDtoSchema = z.array(TeacherCareerListItemDtoSchema);

/* ─────────────────────────────────────────────────────
 * 선생님 기본 정보 Payload
 * UPDATE
 * ────────────────────────────────────────────────────*/
const BasicInfoPayloadSchema = z.object({
  name: z.string(),
  isProfilePublic: z.boolean(),
  simpleIntroduction: z.string(),
});

/* ─────────────────────────────────────────────────────
 * 선생님 대표 수업노트 Payload
 * UPDATE
 * ────────────────────────────────────────────────────*/
const TeachingNoteRepresentativePayloadSchema = z.object({
  representative: z.boolean(),
});

/* ─────────────────────────────────────────────────────
 * 선생님 경력 Payload
 * POST / UPDATE
 * ────────────────────────────────────────────────────*/
const CareerPayloadSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
});

/* ─────────────────────────────────────────────────────
 * 선생님 후기 목록 조회 Query
 * ────────────────────────────────────────────────────*/
const TeacherReviewListQuerySchema = z.object({
  page: z.number(),
  size: z.number(),
  type: z.enum(['STUDYROOM_REVIEW', 'HANDWRITTEN_LETTER']),
});

const TeacherNoteListSchema = z.object({
  page: z.number(),
  size: z.number(),
  sortKey: z.enum([
    'LATEST_EDITED',
    'OLDEST_EDITED',
    'TITLE_ASC',
    'TAUGHT_AT_ASC',
  ]),
});

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const dto = {
  basicInfo: BasicInfoDtoSchema,
  teacherReport: TeacherReportDtoSchema,
  teacherNoteList: TeacherNoteListDtoSchema,
  teacherRepresentativeNoteList: TeacherRepresentativeNoteListDtoSchema,
  teacherStudyRoomList: TeacherStudyRoomListDtoSchema,
  teacherReviewList: TeacherReviewListDtoSchema,
  teacherCareerList: TeacherCareerListDtoSchema,
};

export const payload = {
  basicInfo: BasicInfoPayloadSchema,
  teachingNoteRepresentative: TeachingNoteRepresentativePayloadSchema,
  career: CareerPayloadSchema,
};

export const query = {
  teacherReviewList: TeacherReviewListQuerySchema,
  teacherNoteList: TeacherNoteListSchema,
};
