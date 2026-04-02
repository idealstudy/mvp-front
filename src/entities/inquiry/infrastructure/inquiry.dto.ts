import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * Status Schema
 * ────────────────────────────────────────────────────*/
export const InquiryStatusSchema = z.enum(['PENDING', 'ANSWERED']);

/* ─────────────────────────────────────────────────────
 * 문의 상세 DTO
 * ────────────────────────────────────────────────────*/
const InquiryDetailDtoSchema = z.object({
  id: z.number(),
  inquirerId: z.number(),
  inquirerName: z.string(),
  targetTeacherId: z.number(),
  studyRoomId: z.number().nullish(),
  studyRoomName: z.string().nullish(),
  title: z.string(),
  content: z.string(),
  resolvedContent: z.object({
    content: z.string(),
    expiresAt: z.string().nullable(),
  }),
  status: InquiryStatusSchema,
  regDate: z.string(),
  modDate: z.string(),
  answer: z
    .object({
      id: z.number(),
      content: z.string(),
      resolvedContent: z.object({
        content: z.string(),
        expiresAt: z.string().nullable(),
      }),
      regDate: z.string().nullable(),
      modDate: z.string(),
    })
    .optional(),
});

/* ─────────────────────────────────────────────────────
 * 마이페이지 작성한 문의 목록 DTO
 * ────────────────────────────────────────────────────*/
const InquiryListItemDtoSchema = z.object({
  id: z.number(),
  targetTeacherId: z.number(),
  studyRoomId: z.number().nullish(),
  studyRoomName: z.string().nullish(),
  title: z.string(),
  status: InquiryStatusSchema,
  regDate: z.string(),
});

const InquiryListDtoSchema = z.object({
  totalPages: z.number(),
  totalElements: z.number(),
  content: z.array(InquiryListItemDtoSchema),
});

/* ─────────────────────────────────────────────────────
 * 문의 등록 Payload
 * POST
 * ────────────────────────────────────────────────────*/
const InquiryPayloadSchema = z.object({
  targetTeacherId: z.number(),
  studyRoomId: z.number().optional(),
  title: z.string(),
  content: z.string(),
  mediaIds: z.array(z.string()).optional(),
});

/* ─────────────────────────────────────────────────────
 * 답변 등록 Payload
 * POST
 * ────────────────────────────────────────────────────*/
const InquiryAnswerPayloadSchema = z.object({
  content: z.string(),
  mediaIds: z.array(z.string()).optional(),
});

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const dto = {
  detail: InquiryDetailDtoSchema,
  listItem: InquiryListItemDtoSchema,
  list: InquiryListDtoSchema,
};

export const payload = {
  create: InquiryPayloadSchema,
  createAnswer: InquiryAnswerPayloadSchema,
  updateAnswer: InquiryAnswerPayloadSchema,
};
