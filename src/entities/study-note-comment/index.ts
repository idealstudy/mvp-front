import { domain } from '@/entities/study-note-comment/core';
import { dto } from '@/entities/study-note-comment/infrastructure';

/* ─────────────────────────────────────────────────────
 * API
 * ────────────────────────────────────────────────────*/
export * from './infrastructure';
export * from './core';

/* ─────────────────────────────────────────────────────
 * 스키마
 * ────────────────────────────────────────────────────*/
export const comment = {
  dto,
  domain,
};

/* ─────────────────────────────────────────────────────
 * 타입
 * ────────────────────────────────────────────────────*/
export * from './types';
