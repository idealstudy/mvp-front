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

/* ─────────────────────────────────────────────────────
 * Payload
 * ────────────────────────────────────────────────────*/
export type CreateConsultationPayload = z.infer<typeof payload.create>;
