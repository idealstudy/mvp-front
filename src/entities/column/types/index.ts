import { dto, payload } from '@/entities/column/infrastructure/column.dto';
import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * Sort Type
 * ────────────────────────────────────────────────────*/
export type ColumnSortOption = 'LATEST' | 'POPULAR';

/* ─────────────────────────────────────────────────────
 * Status Type
 * ────────────────────────────────────────────────────*/
export type ColumnStatus = 'PENDING_APPROVAL' | 'APPROVED';

/* ─────────────────────────────────────────────────────
 * Frontend Type
 * ────────────────────────────────────────────────────*/
export type ColumnListItem = z.infer<typeof dto.listItem>;
export type ColumnPage = z.infer<typeof dto.page>;
export type ColumnDetail = z.infer<typeof dto.detail>;
export type MyColumnListItem = z.infer<typeof dto.myListItem>;
export type MyColumnPage = z.infer<typeof dto.myPage>;
export type AdminColumnListItem = z.infer<typeof dto.adminListItem>;
export type AdminColumnPage = z.infer<typeof dto.adminPage>;

/* ─────────────────────────────────────────────────────
 * Payload
 * ────────────────────────────────────────────────────*/
export type CreateColumnArticlePayload = z.infer<typeof payload.create>;
export type UpdateColumnArticlePayload = z.infer<typeof payload.update>;
