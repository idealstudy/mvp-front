import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 학생 기본 정보 DTO
 * ──────────────────────────────────────────────────── */
const BasicInfoDtoSchema = z.object({
  name: z.string(),
  email: z.string(),
  isProfilePublic: z.boolean(),
  learningGoal: z.string().nullable(),
});

/* ─────────────────────────────────────────────────────
 * 프로필 - 학생 통계 조회 DTO
 * ──────────────────────────────────────────────────── */
const StudentProfileReportDtoSchema = z.object({
  studyRoomCount: z.number(),
  questionCount: z.number(),
  totalHomeworkCount: z.number(),
  submittedHomeworkCount: z.number(),
  homeworkCompletionRate: z.number(),
});

/* ─────────────────────────────────────────────────────
 * 프로필 - 학생 과제 조회 DTO
 * ──────────────────────────────────────────────────── */
const StudentProfileHomeworkListItemDtoSchema = z.object({
  studyRoomId: z.number(),
  studyRoomName: z.string(),
  id: z.number(),
  title: z.string(),
  modDate: z.string(),
  deadline: z.string(),
  deadlineLabel: z.enum(['UPCOMING', 'TODAY', 'OVERDUE']),
  status: z.enum(['NOT_SUBMIT', 'SUBMIT', 'LATE_SUBMIT']),
  submittedAt: z.string().nullable(),
  dday: z.number(),
});

const StudentProfileHomeworkListDtoSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(StudentProfileHomeworkListItemDtoSchema),
});

/* ─────────────────────────────────────────────────────
 * 프로필 - 학생 질문 조회 DTO
 * ──────────────────────────────────────────────────── */
const StudentProfileQnaListItemDtoSchema = z.object({
  studyRoomId: z.number(),
  studyRoomName: z.string(),
  id: z.number(),
  title: z.string(),
  status: z.enum(['PENDING', 'COMPLETED']),
  visibility: z.enum(['STUDENT_ONLY', 'STUDENT_AND_PARENT']),
  relatedTeachingNote: z
    .object({
      id: z.number(),
      title: z.string(),
    })
    .nullable(),
  viewCount: z.number(),
  regDate: z.string(),
  read: z.boolean(),
});

const StudentProfileQnaListDtoSchema = z.object({
  number: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(StudentProfileQnaListItemDtoSchema),
});

/* ─────────────────────────────────────────────────────
 * 프로필 - 학생 수업노트 조회 DTO
 * ──────────────────────────────────────────────────── */
const StudentProfileTeachingNoteListItemDtoSchema = z.object({
  id: z.number(),
  studyRoomId: z.number(),
  studyRoomName: z.string(),
  groupId: z.number().nullable(),
  groupName: z.string().nullable(),
  teacherName: z.string(),
  title: z.string(),
  visibility: z.enum([
    'TEACHER_ONLY',
    'SPECIFIC_STUDENTS_ONLY',
    'SPECIFIC_STUDENTS_AND_PARENTS',
    'STUDY_ROOM_STUDENTS_ONLY',
    'STUDY_ROOM_STUDENTS_AND_PARENTS',
    'PUBLIC',
  ]),
  taughtAt: z.string(),
  updatedAt: z.string(),
});

const StudentProfileTeachingNoteListDtoSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(StudentProfileTeachingNoteListItemDtoSchema),
});

/* ─────────────────────────────────────────────────────
 * 프로필 - 학생 참여 스터디룸 조회 DTO
 * ──────────────────────────────────────────────────── */
const StudentProfileStudyRoomListDtoSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    teacherId: z.number(),
    visibility: z.enum(['PRIVATE', 'PUBLIC']),
    teachingNoteCount: z.number(),
    studentCount: z.number(),
    qnaCount: z.number(),
    state: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'TERMINATED']),
  })
);

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

/* ─────────────────────────────────────────────────────
 * 프로필 - 학생 기본 정보 Payload
 * ────────────────────────────────────────────────────*/
const UpdateBasicInfoPayloadSchema = z.object({
  name: z.string(),
  isProfilePublic: z.boolean(),
  learningGoal: z.string(),
});

/* ─────────────────────────────────────────────────────
 * 프로필 - 학생 과제 조회 Query
 * ────────────────────────────────────────────────────*/
const StudentHomeworkListQuerySchema = z.object({
  page: z.number(),
  size: z.number(),
  sortKey: z.enum([
    'LATEST',
    'LATEST_EDITED',
    'OLDEST_EDITED',
    'DEADLINE_IMMINENT',
    'DEADLINE_RECENT',
  ]),
  keyword: z.string().optional(),
});

/* ─────────────────────────────────────────────────────
 * 프로필 - 학생 질문 조회 Query
 * ────────────────────────────────────────────────────*/
const StudentQnaListQuerySchema = z.object({
  page: z.number(),
  size: z.number(),
  status: z.enum(['PENDING', 'COMPLETED']).optional(),
  sort: z.enum(['LATEST', 'OLDEST', 'ALPHABETICAL']).optional(),
  searchKeyword: z.string().optional(),
});

/* ─────────────────────────────────────────────────────
 * 프로필 - 학생 수업노트 조회 Query
 * ──────────────────────────────────────────────────── */
const StudentTeachingNoteListQuerySchema = z.object({
  page: z.number(),
  size: z.number(),
  sortKey: z.enum([
    'LATEST_EDITED',
    'OLDEST_EDITED',
    'TITLE_ASC',
    'TAUGHT_AT_ASC',
  ]),
  keyword: z.string().optional(),
});

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const dto = {
  profile: {
    basicInfo: BasicInfoDtoSchema,
    report: StudentProfileReportDtoSchema,
    homeworkList: StudentProfileHomeworkListDtoSchema,
    qnaList: StudentProfileQnaListDtoSchema,
    teachingNoteList: StudentProfileTeachingNoteListDtoSchema,
    studyRoomList: StudentProfileStudyRoomListDtoSchema,
  },
  dashboard: {
    report: StudentDashboardReportDtoSchema,
    noteList: StudentDashboardNoteListDtoSchema,
    studyRoomList: StudentDashboardStudyRoomListDtoSchema,
    qnaList: StudentDashboardQnaListDtoSchema,
    homeworkList: StudentDashboardHomeworkListDtoSchema,
  },
};

export const payload = {
  updateBasicInfo: UpdateBasicInfoPayloadSchema,
};

export const query = {
  profile: {
    homeworkList: StudentHomeworkListQuerySchema,
    qnaList: StudentQnaListQuerySchema,
    teachingNoteList: StudentTeachingNoteListQuerySchema,
  },
};
