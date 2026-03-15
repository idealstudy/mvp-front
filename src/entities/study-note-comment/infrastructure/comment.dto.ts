import { dto as memberDto } from '@/entities/member';
import { sharedSchema } from '@/types';
import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 공통 하위 DTO - 댓글 해석 결과
 * ──────────────────────────────────────────────────── */
const CommentResolvedContentDtoSchema = z.object({
  content: z.string(),
  expiresAt: z.string().datetime(),
});

/* ─────────────────────────────────────────────────────
 * 공통 하위 DTO - 댓글 작성자 정보
 * ──────────────────────────────────────────────────── */
const CommentAuthorInfoDtoSchema = z.object({
  id: z.number().int().nonnegative(),
  role: memberDto.role,
  name: z.string(),
});

/* ─────────────────────────────────────────────────────
 * 공통 하위 DTO - 대댓글 아이템
 * ──────────────────────────────────────────────────── */
const CommentChildItemDtoSchema = z.object({
  id: z.number().int().nonnegative(),
  content: z.string(),
  resolvedContent: CommentResolvedContentDtoSchema,
  deletedAt: z.string().datetime().nullable(),
  authorInfo: CommentAuthorInfoDtoSchema,
  readCount: z.number().int(),
});

/* ─────────────────────────────────────────────────────
 * 댓글 아이템 DTO
 * ──────────────────────────────────────────────────── */
const CommentItemDtoSchema = z.object({
  id: z.number().int().nonnegative(),
  content: z.string(),
  resolvedContent: CommentResolvedContentDtoSchema,
  deletedAt: z.string().datetime().nullable(),
  authorInfo: CommentAuthorInfoDtoSchema,
  readCount: z.number().int(),
  children: z.array(CommentChildItemDtoSchema),
});

/* ─────────────────────────────────────────────────────
 * 댓글 읽음 정보 조회 DTO
 * ──────────────────────────────────────────────────── */
const CommentItemReadDtoSchema = CommentAuthorInfoDtoSchema.extend({
  readAt: z.string().datetime(),
});

/* ─────────────────────────────────────────────────────
 * 댓글/대댓글 생성 요청 DTO
 * POST /api/public/teaching-notes/{teachingNoteId}/comments
 * ──────────────────────────────────────────────────── */
const CommentCreateRequestSchema = z.object({
  parentCommentId: z.number().int().nullable(),
  content: z.string(),
  mediaIds: z.array(z.string()),
});

/* ─────────────────────────────────────────────────────
 * 댓글/대댓글 수정 요청 DTO
 * PUT /api/public/teaching-notes/{teachingNoteId}/comments/{commentId}
 * ──────────────────────────────────────────────────── */
const CommentUpdateRequestSchema = z.object({
  content: z.string(),
  mediaIds: z.array(z.string()),
});

/* ─────────────────────────────────────────────────────
 * 댓글 목록 data DTO
 * ──────────────────────────────────────────────────── */
const CommentListResponseDataSchema = z.array(CommentItemDtoSchema);

/* ─────────────────────────────────────────────────────
 * 댓글 읽음 정보 data DTO
 * ──────────────────────────────────────────────────── */
const CommentReadResponseDataSchema = z.array(CommentItemReadDtoSchema);

/* ─────────────────────────────────────────────────────
 * API 응답 envelope (status/message/data)
 * ──────────────────────────────────────────────────── */
const CommentListEnvelopeSchema = sharedSchema.response(
  CommentListResponseDataSchema
);

const CommentReadEnvelopeSchema = sharedSchema.response(
  CommentReadResponseDataSchema
);

const CommentCreateEnvelopeSchema = sharedSchema.response(
  sharedSchema.successId
);

const CommentUpdateEnvelopeSchema = sharedSchema.response(sharedSchema.empty);

const CommentDeleteEnvelopeSchema = sharedSchema.response(sharedSchema.empty);

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ──────────────────────────────────────────────────── */
export const dto = {
  resolvedContent: CommentResolvedContentDtoSchema,
  authorInfo: CommentAuthorInfoDtoSchema,
  childItem: CommentChildItemDtoSchema,
  item: CommentItemDtoSchema,
  readItem: CommentItemReadDtoSchema,

  createRequest: CommentCreateRequestSchema,
  updateRequest: CommentUpdateRequestSchema,

  list: CommentListResponseDataSchema,
  readList: CommentReadResponseDataSchema,

  listEnvelope: CommentListEnvelopeSchema,
  readEnvelope: CommentReadEnvelopeSchema,
  createEnvelope: CommentCreateEnvelopeSchema,
  updateEnvelope: CommentUpdateEnvelopeSchema,
  deleteEnvelope: CommentDeleteEnvelopeSchema,
};
