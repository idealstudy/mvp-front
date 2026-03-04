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

/* ─────────────────────────────────────────────────────
 * 학생 대시보드 활동 통계 조회
 * ────────────────────────────────────────────────────*/
const StudentDashboardReportDtoSchema = z.object({
  studyRoomCount: z.number(),
  teachingNoteCount: z.number(),
  studentCount: z.number(),
  qnaCount: z.number(),
});

/* ─────────────────────────────────────────────────────
 * 학생 대시보드 수업노트 목록 조회
 * ────────────────────────────────────────────────────*/
const StudentDashboardNoteListDtoSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      studyRoomId: z.number(),
      studyRoomName: z.string(),
      contentPreview: z.string(),
    })
  ),
});

/* ─────────────────────────────────────────────────────
 * 학생 대시보드 스터디룸 목록 조회
 * ────────────────────────────────────────────────────*/
const StudentDashboardStudyRoomListDtoSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
  })
);

/* ─────────────────────────────────────────────────────
 * 학생 대시보드 답변 받은 질문 목록 조회
 * ────────────────────────────────────────────────────*/
const StudentDashboardQnaListDtoSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(
    z.object({
      id: z.number(),
      studyRoomId: z.number(),
      studyRoomName: z.string(),
      studentId: z.number(),
      studentName: z.string(),
      title: z.string(),
      contentPreview: z.string(),
      regDate: z.string(),
    })
  ),
});

/* ─────────────────────────────────────────────────────
 * 학생 대시보드 과제 목록 조회
 * ────────────────────────────────────────────────────*/
const StudentDashboardHomeworkListDtoSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      studyRoomId: z.number(),
      studyRoomName: z.string(),
      regDate: z.string(),
      deadlineLabel: z.enum(['UPCOMING', 'TODAY', 'OVERDUE']),
      submittedRatePercent: z.number(),
      dday: z.number(),
    })
  ),
});

export const dto = {
  studentReport: StudentReportDtoSchema,
  dashboard: {
    report: StudentDashboardReportDtoSchema,
    noteList: StudentDashboardNoteListDtoSchema,
    studyRoomList: StudentDashboardStudyRoomListDtoSchema,
    QnaList: StudentDashboardQnaListDtoSchema,
    homeworkList: StudentDashboardHomeworkListDtoSchema,
  },
};
