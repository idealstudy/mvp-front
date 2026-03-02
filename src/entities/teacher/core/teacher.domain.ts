import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 선생님 기본 정보 Domain 스키마
 * ────────────────────────────────────────────────────*/
const BasicInfoDomainSchema = z.object({
  name: z.string(),
  email: z.string(),
  isProfilePublic: z.boolean(),
  simpleIntroduction: z.string(),
  role: z.literal('ROLE_TEACHER'),
  profilePublicKorean: z.enum(['공개', '비공개']),
});

/* ─────────────────────────────────────────────────────
 * 선생님 통계 Domain 스키마
 * ────────────────────────────────────────────────────*/
const TeacherReportDomainSchema = z.object({
  studyRoomCount: z.number(),
  teachingNoteCount: z.number(),
  studentCount: z.number(),
  qnaCount: z.number(),
  reviewCount: z.number(),
});

/* ─────────────────────────────────────────────────────
 * 선생님 수업 노트 Domain 스키마
 * ────────────────────────────────────────────────────*/
const TeacherNoteListItemDomainSchema = z.object({
  id: z.number(),
  name: z.string(),
  studyRoomId: z.number(),
  studyRoomName: z.string(),
  qnaCount: z.number(),
  viewCount: z.number(),
  modDate: z.string(),
  representative: z.boolean(),
});

/* ─────────────────────────────────────────────────────
 * 선생님 전체 수업 노트 목록 Domain 스키마 (페이지네이션)
 * ────────────────────────────────────────────────────*/
const TeacherNoteListDomainSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(TeacherNoteListItemDomainSchema),
});

/* ─────────────────────────────────────────────────────
 * 선생님 대표 수업 노트 목록 Domain 스키마
 * ────────────────────────────────────────────────────*/
const TeacherRepresentativeNoteListDomainSchema = z.array(
  TeacherNoteListItemDomainSchema
);

/* ─────────────────────────────────────────────────────
 * 선생님 스터디룸 전체 Domain 스키마
 * ────────────────────────────────────────────────────*/
const TeacherStudyRoomListItemDomainSchema = z.object({
  id: z.number(),
  name: z.string(),
  teachingNoteCount: z.number(),
  studentCount: z.number(),
  qnaCount: z.number(),
});

const TeacherStudyRoomListDomainSchema = z.array(
  TeacherStudyRoomListItemDomainSchema
);

/* ─────────────────────────────────────────────────────
 * 선생님 후기 전체 Domain 스키마
 * ────────────────────────────────────────────────────*/
const TeacherReviewListItemDomainSchema = z.object({
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

const TeacherReviewListDomainSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(TeacherReviewListItemDomainSchema),
});

/* ─────────────────────────────────────────────────────
 * 선생님 경력 전체 Domain 스키마
 * ────────────────────────────────────────────────────*/
const TeacherCareerListItemDomainSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
});

const TeacherCareerListDomainSchema = z.array(
  TeacherCareerListItemDomainSchema
);

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const domain = {
  basicInfo: BasicInfoDomainSchema,
  teacherReport: TeacherReportDomainSchema,
  teacherNoteListItem: TeacherNoteListItemDomainSchema,
  teacherNoteList: TeacherNoteListDomainSchema,
  teacherRepresentativeNoteList: TeacherRepresentativeNoteListDomainSchema,
  teacherStudyRoomListItem: TeacherStudyRoomListItemDomainSchema,
  teacherStudyRoomList: TeacherStudyRoomListDomainSchema,
  teacherReviewListItem: TeacherReviewListItemDomainSchema,
  teacherReviewList: TeacherReviewListDomainSchema,
  teacherCareerListItem: TeacherCareerListItemDomainSchema,
  teacherCareerList: TeacherCareerListDomainSchema,
};
