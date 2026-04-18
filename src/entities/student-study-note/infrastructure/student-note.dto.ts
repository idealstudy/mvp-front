import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * Timer - 진행 중인 학습 일지 조회
 * GET /api/student/study-note/timer/progress
 * ────────────────────────────────────────────────────*/
export const StudentNoteTimerProgressSchema = z.object({
  id: z.number().int(),
  studentId: z.number().int().nullable(),
  title: z.string().nullable(),
  subject: z.string().nullable(),
  content: z.string().nullable(),
  status: z.string().nullable(),
  studyTime: z.number().int().nullable(),
  regDate: z.string().nullable(),
  modDate: z.string().nullable(),
  restartTime: z.string().nullable(),
  resolvedContent: z
    .object({
      content: z.string().nullable().optional(),
      expiresAt: z.string().nullable().optional(),
    })
    .passthrough()
    .nullable()
    .optional(),
  ongoing: z.boolean(),
  contentPreview: z.string().nullable().optional(),
});

/* ─────────────────────────────────────────────────────
 * Timer - 공통 Payload
 * POST /api/student/study-note/timer/start
 * POST /api/student/study-note/timer/pause/{studyNoteId}
 * POST /api/student/study-note/timer/finish/{studyNoteId}
 * POST /api/student/study-note/temp/{studyNoteId}
 * POST /api/student/study-note
 * ────────────────────────────────────────────────────*/
export const StudentNoteWritePayloadSchema = z.object({
  title: z.string(),
  subject: z.string(),
  content: z.string(),
  mediaIds: z.array(z.string()),
  finishTimestamp: z.string(),
});

/* ─────────────────────────────────────────────────────
 * Timer - 학습 시간 측정 시작 응답
 * POST /api/student/study-note/timer/start
 * ────────────────────────────────────────────────────*/
export const StudentNoteTimerStartResponseSchema = z.object({
  id: z.number().int(),
});

export const StudentNoteTimerStartPayloadSchema = StudentNoteWritePayloadSchema;
export const StudentNoteTimerFinishPayloadSchema =
  StudentNoteWritePayloadSchema;
export const StudentNoteTimerPausePayloadSchema = StudentNoteWritePayloadSchema;
export const StudentNoteTimerTempSavePayloadSchema =
  StudentNoteWritePayloadSchema;

/* ─────────────────────────────────────────────────────
 * Timer - 학습 시간 초기화
 * POST /api/student/study-note/timer/reset/{studyNoteId}
 * ────────────────────────────────────────────────────*/
export const StudentNoteTimerResetResponseSchema = z.object({
  data: z.string(),
});

/* ─────────────────────────────────────────────────────
 * Calendar - 월 학습 시간 조회
 * GET /api/common/study-note/month/{studentId}
 * ────────────────────────────────────────────────────*/
export const StudentNoteMonthlyQuerySchema = z.object({
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
});

export const StudentNoteMonthlyResponseSchema = z.object({
  totalStudyTime: z.number().int(),
  list: z.array(
    z.object({
      day: z.number().int(),
      studyTime: z.number().int(),
    })
  ),
});

/* ─────────────────────────────────────────────────────
 * Calendar - 일일 학습 기록 조회
 * GET /api/common/study-note/daily/{studentId}
 * ────────────────────────────────────────────────────*/
export const StudentNoteDailyQuerySchema = z.object({
  studentId: z.number().int(),
  date: z.string(), // YYYY-MM-DD
});

export const StudentNoteDailyResponseSchema = z.object({
  totalStudyTime: z.number().int(),
  list: z.array(
    z.object({
      id: z.number().int(),
      title: z.string().nullable(),
      subject: z.string().nullable(),
      studyTime: z.number().int(),
    })
  ),
});

/* ─────────────────────────────────────────────────────
 * CRUD - 학습 일지 작성 (타이머 없이)
 * POST /api/student/study-note
 * ────────────────────────────────────────────────────*/
export const StudentNoteCreatePayloadSchema = StudentNoteWritePayloadSchema;

/* ─────────────────────────────────────────────────────
 * CRUD - 학습 일지 목록 조회
 * GET /api/common/study-note/list
 * ────────────────────────────────────────────────────*/
export const StudentNoteListItemSchema = z.object({
  id: z.number().int(),
  studentId: z.number().int().nullable().optional(),
  title: z.string().nullable(),
  subject: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  studyTime: z.number().int().nullable(),
  regDate: z.string().nullable().optional(),
  modDate: z.string().nullable().optional(),
  restartTime: z.string().nullable().optional(),
  ongoing: z.boolean().nullable().optional(),
});

export const StudentNoteListResponseSchema = z.object({
  pageNumber: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  content: z.array(StudentNoteListItemSchema),
});

/* ─────────────────────────────────────────────────────
 * CRUD - 학습 일지 상세 조회
 * GET /api/common/study-note/{studyNoteId}
 * ────────────────────────────────────────────────────*/
export const StudentNoteDetailSchema = z.object({
  id: z.number(),
  studentId: z.number().nullable().optional(),
  title: z.string().nullable().optional(),
  subject: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  studyTime: z.number().nullable().optional(),
  regDate: z.string().nullable().optional(),
  modDate: z.string().nullable().optional(),
  restartTime: z.string().nullable().optional(),
  resolvedContent: z
    .object({
      content: z.string().nullable().optional(),
      expiresAt: z.string().nullable().optional(),
    })
    .passthrough()
    .nullable()
    .optional(),
  ongoing: z.boolean().nullable().optional(),
  contentPreview: z.string().nullable().optional(),
});

/* ─────────────────────────────────────────────────────
 * CRUD - 학습 일지 수정
 * PUT /api/student/study-note/{studyNoteId}
 * ────────────────────────────────────────────────────*/
export const StudentNoteUpdatePayloadSchema = StudentNoteWritePayloadSchema;

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const studentNoteDto = {
  timer: {
    progress: StudentNoteTimerProgressSchema,
    startResponse: StudentNoteTimerStartResponseSchema,
    resetResponse: StudentNoteTimerResetResponseSchema,
  },
  calendar: {
    monthlyResponse: StudentNoteMonthlyResponseSchema,
    dailyResponse: StudentNoteDailyResponseSchema,
  },
  crud: {
    listResponse: StudentNoteListResponseSchema,
    detail: StudentNoteDetailSchema,
  },
};

export const studentNotePayload = {
  timerStart: StudentNoteTimerStartPayloadSchema,
  timerFinish: StudentNoteTimerFinishPayloadSchema,
  timerPause: StudentNoteTimerPausePayloadSchema,
  timerTempSave: StudentNoteTimerTempSavePayloadSchema,
  monthlyQuery: StudentNoteMonthlyQuerySchema,
  dailyQuery: StudentNoteDailyQuerySchema,
  create: StudentNoteCreatePayloadSchema,
  update: StudentNoteUpdatePayloadSchema,
};
