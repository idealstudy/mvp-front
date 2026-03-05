import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 선생님 통계 조회 DTO
 * ──────────────────────────────────────────────────── */
const TeacherReportDtoSchema = z.object({
  studyRoomCount: z.number(),
  teachingNoteCount: z.number(),
  studentCount: z.number(),
  qnaCount: z.number(),
  reviewCount: z.number(),
});

/* ─────────────────────────────────────────────────────
 * 선생님 수업 노트 전체 목록 조회 DTO
 * ────────────────────────────────────────────────────*/
const TeacherNoteListItemDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  studyRoomId: z.number(),
  studyRoomName: z.string(),
  qnaCount: z.number(),
  viewCount: z.number(),
  modDate: z.string(),
  representative: z.boolean(),
});

const TeacherNoteListDtoSchema = z.array(TeacherNoteListItemDtoSchema);

/* ─────────────────────────────────────────────────────
 * 선생님 스터디룸 전체 목록 조회 응답 DTO
 * ────────────────────────────────────────────────────*/
const TeacherStudyRoomListItemDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  teachingNoteCount: z.number(),
  studentCount: z.number(),
  qnaCount: z.number(),
});

const TeacherStudyRoomListDtoSchema = z.array(
  TeacherStudyRoomListItemDtoSchema
);

/* ─────────────────────────────────────────────────────
 * 선생님 대시보드 활동 통계 조회 DTO
 * ────────────────────────────────────────────────────*/
const TeacherDashboardReportDtoSchema = z.object({
  studyRoomCount: z.number(),
  teachingNoteCount: z.number(),
  studentCount: z.number(),
  qnaCount: z.number(),
});

/* ─────────────────────────────────────────────────────
 * 선생님 대시보드 수업 노트 전체 목록 조회 DTO
 * ────────────────────────────────────────────────────*/
const TeacherDashboardNoteListItemDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  studyRoomId: z.number(),
  studyRoomName: z.string(),
  contentPreview: z.string(),
});

const TeacherDashboardNoteListDtoSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(TeacherDashboardNoteListItemDtoSchema),
});

/* ─────────────────────────────────────────────────────
 * 선생님 대시보드 스터디룸 목록 조회
 * ────────────────────────────────────────────────────*/
const TeacherDashboardStudyRoomListDtoSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
  })
);

/* ─────────────────────────────────────────────────────
 * 선생님 대시보드 답변 하지 않은 질문 목록 조회
 * ────────────────────────────────────────────────────*/
const TeacherDashboardQnaListDtoSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(
    z.object({
      id: z.number(),
      studentId: z.number(),
      studentName: z.string(),
      studyRoomId: z.number(),
      studyRoomName: z.string(),
      title: z.string(),
      contentPreview: z.string(),
      regDate: z.string(), //"2026-03-04T18:37:44.993Z"
    })
  ),
});

/* ─────────────────────────────────────────────────────
 * 선생님 대시보드 멤버 목록 조회
 * ────────────────────────────────────────────────────*/
const TeacherDashboardMemberListDtoSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(
    z.object({
      role: z.enum([
        'ROLE_ADMIN',
        'ROLE_TEACHER',
        'ROLE_STUDENT',
        'ROLE_PARENT',
        'ROLE_MEMBER',
      ]),
      id: z.number(),
      name: z.string(),
      email: z.string(),
      joinDate: z.string(), //"2026-03-04T18:37:44.993Z"
      state: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'TERMINATED']),
      studyRoomId: z.number(),
      studyRoomName: z.string(),
    })
  ),
});

/* ─────────────────────────────────────────────────────
 * 선생님 대시보드 과제 목록 조회
 * ────────────────────────────────────────────────────*/
const TeacherDashboardHomeworkListDtoSchema = z.object({
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
      regDate: z.string(), //"2026-03-04T18:37:44.993Z"
      deadlineLabel: z.enum(['UPCOMING', 'TODAY', 'OVERDUE']),
      submittedRatePercent: z.number(), // 0~100
      dday: z.number(), // 마감까지 D-day (음수면 마감 지남)
    })
  ),
});

/* ─────────────────────────────────────────────────────
 * 선생님 기본 정보 DTO
 * ────────────────────────────────────────────────────*/
const BasicInfoDtoSchema = z.object({
  name: z.string(),
  email: z.string(),
  isProfilePublic: z.boolean(),
  simpleIntroduction: z.string(),
});

/* ─────────────────────────────────────────────────────
 * 선생님 기본 정보 Payload
 * ────────────────────────────────────────────────────*/
const UpdateBasicInfoPayloadSchema = z.object({
  name: z.string(),
  isProfilePublic: z.boolean(),
  simpleIntroduction: z.string(),
});

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const dto = {
  basicInfo: BasicInfoDtoSchema,
  teacherReport: TeacherReportDtoSchema,
  teacherNoteList: TeacherNoteListDtoSchema,
  teacherStudyRoomList: TeacherStudyRoomListDtoSchema,
  dashboard: {
    report: TeacherDashboardReportDtoSchema,
    noteList: TeacherDashboardNoteListDtoSchema,
    studyRoomList: TeacherDashboardStudyRoomListDtoSchema,
    QnaList: TeacherDashboardQnaListDtoSchema,
    memberList: TeacherDashboardMemberListDtoSchema,
    homeworkList: TeacherDashboardHomeworkListDtoSchema,
  },
};

export const payload = {
  updateBasicInfo: UpdateBasicInfoPayloadSchema,
};
