import { z } from 'zod';

const NotificationCategorySchema = z.enum([
  'SYSTEM',
  'HOMEWORK',
  'TEACHING_NOTE',
  'STUDY_ROOM',
  'QNA',
  'NOTICE',
  'COLUMN_ARTICLE',
  'INQUIRY',
]);

/**
 * targetMetadata: 카테고리별 메타데이터
 * - QNA: qnaId, studyRoomId
 * - STUDY_ROOM: studyRoomId
 * - TEACHING_NOTE: teachingNoteId
 * - HOMEWORK: homeworkId
 * - COLUMN_ARTICLE: articleId, title
 * - INQUIRY: inquiryId, title
 * TODO
 * - SYSTEM: noticeId (예정)
 */
const TargetMetadataSchema = z.object({
  qnaId: z.string().optional(),
  studyRoomId: z.string().optional(),
  teachingNoteId: z.string().optional(),
  homeworkId: z.string().optional(),
  noticeId: z.string().optional(),
  articleId: z.string().optional(),
  inquiryId: z.string().optional(),
  title: z.string().optional(),
});

/* ─────────────────────────────────────────────────────
 * api 응답(DTO 객체)
 * ────────────────────────────────────────────────────*/
const NotificationDtoSchema = z.object({
  id: z.number().int().nonnegative(),
  message: z.string(),
  category: NotificationCategorySchema,
  targetMetadata: TargetMetadataSchema.nullable(),
  regDate: z.string().nullable(),
  read: z.boolean(),
});

export const dto = {
  schema: NotificationDtoSchema,
  arraySchema: z.array(NotificationDtoSchema),
  category: NotificationCategorySchema,
};
