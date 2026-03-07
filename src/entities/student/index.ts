import { domain } from '@/entities/student/core';
import { dto, payload } from '@/entities/student/infrastructure';

export * from './core';
export * from './infrastructure';
export * from './types';

/* ─────────────────────────────────────────────────────
 * 스키마
 * ────────────────────────────────────────────────────*/
export const student = {
  dto,
  domain,
  payload,
};
