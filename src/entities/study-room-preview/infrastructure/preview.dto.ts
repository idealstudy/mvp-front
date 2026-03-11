import { base } from '@/entities/study-room/infrastructure';
import { sharedSchema } from '@/types';
import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 공통 하위 DTO - 학교 정보
 * ──────────────────────────────────────────────────── */
const PreviewSchoolInfoSchema = z.object({
  schoolLevel: z.enum(['ELEMENTARY', 'MIDDLE', 'HIGH', 'OTHER']).nullable(),
  grade: z.number().int().nullable(),
});

/* ─────────────────────────────────────────────────────
 * 공통 하위 DTO - 리뷰 해석 결과
 * ──────────────────────────────────────────────────── */
const PreviewReviewResolvedContentSchema = z.object({
  content: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
});

const PreviewCharacteristicResolvedContentSchema = z.object({
  content: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
});

/* ─────────────────────────────────────────────────────
 * 공통 하위 DTO - 리뷰 아이템
 * ──────────────────────────────────────────────────── */
const PreviewReviewItemSchema = z.object({
  id: z.number().int(),
  srcMemberId: z.number().int(),
  srcMemberName: z.string(),
  dstMemberId: z.number().int(),
  dstMemberName: z.string(),
  studyRoomId: z.number().int(),
  startDate: z.string(),
  endDate: z.string(),
  content: z.string(),
  regDate: z.string(),
  modDate: z.string(),
  resolvedContent: PreviewReviewResolvedContentSchema.nullable().optional(),
});

/* ─────────────────────────────────────────────────────
 * 공통 스터디룸 DTO
 * ──────────────────────────────────────────────────── */
const StudyRoomPreviewCoreSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  characteristic: z.string().nullable().optional(),
  resolvedContent:
    PreviewCharacteristicResolvedContentSchema.nullable().optional(),
  modality: base.modality,
  classForm: base.classForm,
  subjectType: base.subject,
  schoolInfo: PreviewSchoolInfoSchema,
});

/* ─────────────────────────────────────────────────────
 * 스터디룸 main DTO
 * ──────────────────────────────────────────────────── */
const StudyRoomPreviewMainDataSchema = StudyRoomPreviewCoreSchema.extend({
  reviewList: z.array(PreviewReviewItemSchema),
});

/* ─────────────────────────────────────────────────────
 * 다른 스터디룸 아이템 DTO
 * ──────────────────────────────────────────────────── */
const PreviewOtherStudyRoomItemSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().optional(),
  modality: base.modality.optional(),
  classForm: base.classForm.optional(),
  subjectType: base.subject.optional(),
  schoolInfo: PreviewSchoolInfoSchema.optional(),
  capacity: z.number().int().optional(),
  visibility: base.visibility.optional(),
  regDate: z.string().optional(),
  modDate: z.string().optional(),
});

/* ─────────────────────────────────────────────────────
 * 스터디룸 미리보기 통계 data DTO
 * ──────────────────────────────────────────────────── */
const StudyRoomPreviewSideDataSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  otherStudyRooms: z.array(PreviewOtherStudyRoomItemSchema),
  numberOfTeachingNotes: z.number().int(),
  numberOfStudents: z.number().int(),
  numberOfQuestions: z.number().int(),
});

/* ─────────────────────────────────────────────────────
 * API 응답 envelope (status/message/data)
 * ──────────────────────────────────────────────────── */
const StudyRoomPreviewDetailEnvelopeSchema = sharedSchema.response(
  StudyRoomPreviewMainDataSchema
);

const StudyRoomPreviewStatsEnvelopeSchema = sharedSchema.response(
  StudyRoomPreviewSideDataSchema
);

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ──────────────────────────────────────────────────── */
export const dto = {
  schoolInfo: PreviewSchoolInfoSchema,
  reviewResolvedContent: PreviewReviewResolvedContentSchema,
  characteristicResolvedContent: PreviewCharacteristicResolvedContentSchema,
  reviewItem: PreviewReviewItemSchema,

  core: StudyRoomPreviewCoreSchema,
  main: StudyRoomPreviewMainDataSchema,
  statsItem: PreviewOtherStudyRoomItemSchema,
  side: StudyRoomPreviewSideDataSchema,

  detailEnvelope: StudyRoomPreviewDetailEnvelopeSchema,
  statsEnvelope: StudyRoomPreviewStatsEnvelopeSchema,
};
