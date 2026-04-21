import { z } from 'zod';

import { dto } from '../infrastructure';

/* ─────────────────────────────────────────────────────
 * 스터디 노트 도메인 스키마
 * ────────────────────────────────────────────────────*/
const NoteDomainSchema = z.object({
  id: z.number().int(),
  studyRoomId: z.number().int(),
  teachingNoteGroupId: z.number().int(),
  title: z.string(),
  content: z.string(),
  visibility: dto.visibility,
  taughtAt: z.string(),
  updatedAt: z.string().optional(),
  studentIds: z.array(z.number().int()).optional(),
  imageIds: z.array(z.string()).optional(),
});

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const domain = {
  schema: NoteDomainSchema,
};
