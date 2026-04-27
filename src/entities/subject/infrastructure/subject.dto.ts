import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 과목 목록 조회
 * GET /api/public/subject-list
 * ────────────────────────────────────────────────────*/
export const SubjectSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const SubjectListResponseSchema = z.array(SubjectSchema);

export const subjectDto = {
  list: SubjectListResponseSchema,
};
