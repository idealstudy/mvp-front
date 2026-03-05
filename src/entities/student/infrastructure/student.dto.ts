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
  questionCount: z.number(),
  answerCount: z.number(),
  submittedHomeworkCount: z.number(),
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
      studentId: z.number().optional(),
      studentName: z.string().optional(),
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

/**
 * 학생 기본 정보 DTO
 * TODO nullable 확인
 */
const BasicInfoDtoSchema = z.object({
  name: z.string(),
  email: z.string(),
  isProfilePublic: z.boolean(),
  learningGoal: z.string().nullable(),
});

/**
 * 학생 기본 정보 Payload
 */
const UpdateBasicInfoPayloadSchema = z.object({
  name: z.string(),
  isProfilePublic: z.boolean(),
  learningGoal: z.string(),
});

/**
 * 내보내기
 */
export const dto = {
  basicInfo: BasicInfoDtoSchema,
  studentReport: StudentReportDtoSchema,
  dashboard: {
    report: StudentDashboardReportDtoSchema,
    noteList: StudentDashboardNoteListDtoSchema,
    studyRoomList: StudentDashboardStudyRoomListDtoSchema,
    QnaList: StudentDashboardQnaListDtoSchema,
    homeworkList: StudentDashboardHomeworkListDtoSchema,
  },
};

export const payload = {
  updateBasicInfo: UpdateBasicInfoPayloadSchema,
};
