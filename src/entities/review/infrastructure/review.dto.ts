import { z } from 'zod';

const ReviewDetailDtoSchema = z.object({
  id: z.number(),
  srcMemberId: z.number(),
  srcMemberName: z.string(),
  dstMemberId: z.number(),
  dstMemberName: z.string(),
  studyRoomId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  content: z.string(),
  regDate: z.string(),
  modDate: z.string(),
  resolvedContent: z.object({
    content: z.string(),
    expiresAt: z.string().nullable(),
  }),
});

const ReviewPayloadSchema = z.object({
  dstMemberId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  content: z.string(),
  mediaIds: z.array(z.string()).optional(),
});

export const dto = {
  detail: ReviewDetailDtoSchema,
};

export const payload = {
  create: ReviewPayloadSchema,
};
