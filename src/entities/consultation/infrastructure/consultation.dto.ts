import { z } from 'zod';

/** 상세/목록에서 미디어 URL 만료 시각 필드명이 응답마다 다를 수 있어 content만 필수로 둠 */
const ConsultationResolvedContentSchema = z.object({
  content: z.string(),
  expiresAt: z.string().nullable().optional(),
});

const ConsultationDtoSchema = z.object({
  id: z.number(),
  content: z.string(),
  regDate: z.string(),
  modDate: z.string().nullable().optional(),
  resolvedContent: ConsultationResolvedContentSchema.nullable().optional(),
});

const ConsultationListResponseSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  list: z.array(ConsultationDtoSchema),
});

const ConsultationPayloadSchema = z.object({
  content: z.string(),
  mediaIds: z.array(z.string()).optional(),
});

export type ConsultationItem = z.infer<typeof ConsultationDtoSchema>;

export const dto = {
  item: ConsultationDtoSchema,
  list: ConsultationListResponseSchema,
};

export const payload = {
  create: ConsultationPayloadSchema,
  update: ConsultationPayloadSchema,
};
