import { z } from 'zod';

import { dto, payload } from '../infrastructure/review.dto';

export type Review = z.infer<typeof dto.item>;
export type ReviewCreatePayload = z.infer<typeof payload.create>;
export type ReviewUpdatePayload = z.infer<typeof payload.update>;
