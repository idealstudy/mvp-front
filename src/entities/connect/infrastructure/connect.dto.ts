import { dto as memberDto } from '@/entities/member';
import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 공통 enum
 * ────────────────────────────────────────────────────*/
const ConnectStateSchema = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'TERMINATED',
]);
const ConnectListQuerySchema = z.object({
  page: z.number().int(),
  size: z.number().int(),
  sort: z.string().optional(),
});

/* ─────────────────────────────────────────────────────
 * 공통 서브 스키마
 * ────────────────────────────────────────────────────*/
const ConnectOpponentSchema = z.object({
  id: z.number().int(),
  email: z.string(),
  name: z.string(),
  role: memberDto.role,
});

/* ─────────────────────────────────────────────────────
 * 응답 DTO
 * ────────────────────────────────────────────────────*/
const ConnectListItemSchema = z.object({
  id: z.number().int(),
  requesterEmail: z.string(),
  recipientEmail: z.string(),
  state: ConnectStateSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  acceptedAt: z.string().nullable(),
  opponent: ConnectOpponentSchema,
});

const ConnectListPageSchema = z.object({
  connectionList: z.array(ConnectListItemSchema),
  page: z.number().int(),
  size: z.number().int(),
  totalPages: z.number().int(),
  totalElements: z.number().int(),
  last: z.boolean(),
});

export const payload = {
  listQuery: ConnectListQuerySchema,
};

export const dto = {
  state: ConnectStateSchema,
  opponent: ConnectOpponentSchema,
  listItem: ConnectListItemSchema,
  listPage: ConnectListPageSchema,
};
