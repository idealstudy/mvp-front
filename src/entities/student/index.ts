import { domain } from '@/entities/student/core';
import { dto, payload } from '@/entities/student/infrastructure';

/* ─────────────────────────────────────────────────────
 * API
 * ────────────────────────────────────────────────────*/
export * from './infrastructure';
export * from './core';

/* ─────────────────────────────────────────────────────
 * 스키마
 * ────────────────────────────────────────────────────*/
export const student = {
  dto,
  domain,
  payload,
};

/* ─────────────────────────────────────────────────────
 * 타입
 * ────────────────────────────────────────────────────*/
export * from './types';
