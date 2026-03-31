import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 문의 상세 DTO
 * ────────────────────────────────────────────────────*/
const ConsultationDetailDtoSchema = z.object({
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
  status: z.enum(['PENDING', 'ANSWERED']),
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
      regDate: z.string(),
      modDate: z.string(),
    })
    .optional(),
});

/* ─────────────────────────────────────────────────────
 * 마이페이지 작성한 문의 목록 DTO
 * ────────────────────────────────────────────────────*/
const ConsultationListItemDtoSchema = z.object({
  id: z.number(),
  targetTeacherId: z.number(),
  studyRoomId: z.number().nullish(),
  studyRoomName: z.string().nullish(),
  title: z.string(),
  status: z.enum(['PENDING', 'ANSWERED']),
  regDate: z.string(),
});

const ConsultationListDtoSchema = z.object({
  totalPages: z.number(),
  totalElements: z.number(),
  content: z.array(ConsultationListItemDtoSchema),
});

/* ─────────────────────────────────────────────────────
 * 문의 등록 Payload
 * POST
 * ────────────────────────────────────────────────────*/
const CreateConsultationPayloadSchema = z.object({
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
const ConsultationAnswerPayloadSchema = z.object({
  content: z.string(),
  mediaIds: z.array(z.string()).optional(),
});

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const dto = {
  detail: ConsultationDetailDtoSchema,
  listItem: ConsultationListItemDtoSchema,
  list: ConsultationListDtoSchema,
};

export const payload = {
  create: CreateConsultationPayloadSchema,
  createAnswer: ConsultationAnswerPayloadSchema,
};
