import { z } from 'zod';

import { dto } from '../infrastructure';

/* ─────────────────────────────────────────────────────
 * DTO
 * ────────────────────────────────────────────────────*/
export type Consultation = z.infer<typeof dto.item>;
export type ConsultationList = z.infer<typeof dto.list>;
