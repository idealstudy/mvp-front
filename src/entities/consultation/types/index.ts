import {
  dto,
  payload,
} from '@/entities/consultation/infrastructure/consultation.dto';
import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * Status Type
 * ────────────────────────────────────────────────────*/
export type ConsultationStatus = 'PENDING' | 'ANSWERED';

/* ─────────────────────────────────────────────────────
 * Frontend Type
 * ────────────────────────────────────────────────────*/
export type ConsultationDetail = z.infer<typeof dto.detail>;
export type ConsultationListItem = z.infer<typeof dto.listItem>;
export type ConsultationList = z.infer<typeof dto.list>;

/* ─────────────────────────────────────────────────────
 * Payload
 * ────────────────────────────────────────────────────*/
export type CreateConsultationPayload = z.infer<typeof payload.create>;
export type CreateConsultationAnswerPayload = z.infer<
  typeof payload.createAnswer
>;
