import { dto, payload } from '@/entities/review/infrastructure/review.dto';
import { z } from 'zod';

export type Review = z.infer<typeof dto.detail>;
export type ReviewPayload = z.infer<typeof payload.create>;
