import { z } from 'zod';

const ResolvedContentSchema = z.object({
  content: z.string(),
  expiresAt: z.string().nullable(),
});

const ReviewItemDtoSchema = z.object({
  id: z.number(),
  srcMemberId: z.number(),
  srcMemberName: z.string(),
  dstMemberId: z.number(),
  dstMemberName: z.string(),
  studyRoomId: z.number(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  content: z.string(),
  regDate: z.string(),
  modDate: z.string(),
  resolvedContent: ResolvedContentSchema,
});

const ReviewCreatePayloadSchema = z.object({
  dstMemberId: z.number(),
  startDate: z.string(),
  endDate: z.string().optional(),
  content: z.string(),
  mediaIds: z.array(z.string()).optional(),
});

const ReviewUpdatePayloadSchema = z.object({
  startDate: z.string(),
  endDate: z.string().optional(),
  content: z.string(),
  mediaIds: z.array(z.string()),
});

export const dto = {
  item: ReviewItemDtoSchema,
};

export const payload = {
  create: ReviewCreatePayloadSchema,
  update: ReviewUpdatePayloadSchema,
};
