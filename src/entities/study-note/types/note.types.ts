import { z } from 'zod';

import { domain } from '../core/note.domain.schema';
import { dto } from '../infrastructure/note.dto.schema';

/* ─────────────────────────────────────────────────────
 * DTO
 * ────────────────────────────────────────────────────*/
export type NoteVisibility = z.infer<typeof dto.visibility>;
export type StudentInfo = z.infer<typeof dto.studentInfo>;
export type NoteRequest = z.infer<typeof dto.request>;

export type NoteListItem = z.infer<typeof dto.listItem>;
export type NoteDetail = z.infer<typeof dto.detail>;
export type ParentNoteDetail = z.infer<typeof dto.parentDetail>;

/* ─────────────────────────────────────────────────────
 * 도메인
 * ────────────────────────────────────────────────────*/
export type NoteDomain = z.infer<typeof domain.schema>;
