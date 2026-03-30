import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 문의 답변 DTO
 * ────────────────────────────────────────────────────*/
const ConsultationAnswerDtoSchema = z.object({
  id: z.number(),
  content: z.string(),
  regDate: z.string(),
  modDate: z.string(),
});

/* ─────────────────────────────────────────────────────
 * 문의 상세 DTO
 * ────────────────────────────────────────────────────*/
const ConsultationDetailDtoSchema = z.object({
  id: z.number(),
  inquirerId: z.number(),
  inquirerName: z.string(),
  targetTeacherId: z.number(),
  studyRoomId: z.number().nullable(),
  studyRoomName: z.string().nullable(),
  title: z.string(),
  content: z.string(),
  status: z.enum(['PENDING', 'ANSWERED']),
  regDate: z.string(),
  modDate: z.string(),
  answer: ConsultationAnswerDtoSchema.optional(),
});

/* ─────────────────────────────────────────────────────
 * 문의 등록 Payload
 * POST
 * ────────────────────────────────────────────────────*/
const CreateConsultationPayloadSchema = z.object({
  targetTeacherId: z.number(),
  studyRoomId: z.number().optional(),
  title: z.string().min(1),
  content: z.string().min(1),
});

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const dto = {
  detail: ConsultationDetailDtoSchema,
};

export const payload = {
  create: CreateConsultationPayloadSchema,
};
