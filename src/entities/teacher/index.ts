import { domain } from '@/entities/teacher/core';
import { dto, payload } from '@/entities/teacher/infrastructure';

/* ─────────────────────────────────────────────────────
 * API
 * ────────────────────────────────────────────────────*/
export * from './infrastructure';
export * from './core';

/* ─────────────────────────────────────────────────────
 * 스키마
 * ────────────────────────────────────────────────────*/
export const teacher = {
  dto,
  domain,
  payload,
};

/* ─────────────────────────────────────────────────────
 * 타입
 * ────────────────────────────────────────────────────*/
export * from './types';
