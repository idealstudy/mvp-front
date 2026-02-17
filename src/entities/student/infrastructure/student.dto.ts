import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 선생님 통계 조회 DTO
 * ──────────────────────────────────────────────────── */
const StudentReportDtoSchema = z.object({
  studyRoomCount: z.number(),
  questionCount: z.number(),
  totalHomeworkCount: z.number(),
  submittedHomeworkCount: z.number(),
  homeworkCompletionRate: z.number(),
});

export const dto = {
  studentReport: StudentReportDtoSchema,
};
