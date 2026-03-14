import { z } from 'zod';

import { domain } from '../core';
import { dto } from '../infrastructure';

/* ─────────────────────────────────────────────────────
 * DTO
 * ────────────────────────────────────────────────────*/
export type ClassLinkDto = z.infer<typeof dto.listItem>;
export type ClassLinkListDto = z.infer<typeof dto.list>;

/* ─────────────────────────────────────────────────────
 * 도메인
 * ────────────────────────────────────────────────────*/
export type ClassLink = z.infer<typeof domain.listItem>;
