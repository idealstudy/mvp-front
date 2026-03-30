import { z } from 'zod';

import { dto } from '../infrastructure';

/* ─────────────────────────────────────────────────────
 * 학생 대시보드 Domain 스키마
 * ────────────────────────────────────────────────────*/
const StudentDashboardReportShape = dto.dashboard.report;
const StudentDashboardNoteListShape = dto.dashboard.noteList;
const StudentDashboardStudyRoomListShape = dto.dashboard.studyRoomList;
const StudentDashboardQnaListShape = dto.dashboard.qnaList;
const StudentDashboardHomeworkListShape = dto.dashboard.homeworkList;

/* ─────────────────────────────────────────────────────
 * 프로필 - 학생 기본 정보 Domain 스키마
 *────────────────────────────────────────────────────*/
const BasicInfoDomainSchema = z.object({
  name: z.string(),
  email: z.string(),
  isProfilePublic: z.boolean(),
  learningGoal: z.string().nullable(),
  role: z.literal('ROLE_STUDENT'),
  profilePublicKorean: z.enum(['공개', '비공개']),
});

/* ─────────────────────────────────────────────────────
 * 프로필 - 학생 과제 Domain 스키마
 * ────────────────────────────────────────────────────*/
const StudentProfileHomeworkListItemDomainSchema = z.object({
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

const StudentProfileHomeworkListDomainSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(StudentProfileHomeworkListItemDomainSchema),
});

/* ─────────────────────────────────────────────────────
 * 프로필 - 학생 질문 조회 Domain 스키마
 * ──────────────────────────────────────────────────── */
const StudentProfileQnaListItemDomainSchema = z.object({
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

const StudentProfileQnaListDomainSchema = z.object({
  number: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(StudentProfileQnaListItemDomainSchema),
});

/* ─────────────────────────────────────────────────────
 * 프로필 - 학생 수업노트 조회 Domain 스키마
 * ──────────────────────────────────────────────────── */
const StudentProfileTeachingNoteListItemDomainSchema = z.object({
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

const StudentProfileTeachingNoteListDomainSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(StudentProfileTeachingNoteListItemDomainSchema),
});

/* ─────────────────────────────────────────────────────
 * 프로필 - 학생 참여 스터디룸 조회 Domain 스키마
 * ──────────────────────────────────────────────────── */
const StudentProfileStudyRoomListItemDomainSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  teacherId: z.number(),
  visibility: z.enum(['PRIVATE', 'PUBLIC']),
  teachingNoteCount: z.number(),
  studentCount: z.number(),
  qnaCount: z.number(),
  state: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'TERMINATED']),
});

const StudentProfileStudyRoomListDomainSchema = z.array(
  StudentProfileStudyRoomListItemDomainSchema
);

/* ─────────────────────────────────────────────────────
 * 프로필 - 학생 통계 Domain 스키마
 * ────────────────────────────────────────────────────*/
const StudentProfileReportDomainSchema = z.object({
  studyRoomCount: z.number(),
  questionCount: z.number(),
  totalHomeworkCount: z.number(),
  submittedHomeworkCount: z.number(),
  homeworkCompletionRate: z.number(),
});

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const domain = {
  profile: {
    basicInfo: BasicInfoDomainSchema,
    report: StudentProfileReportDomainSchema,
    homeworkListItem: StudentProfileHomeworkListItemDomainSchema,
    homeworkList: StudentProfileHomeworkListDomainSchema,
    qnaListItem: StudentProfileQnaListItemDomainSchema,
    qnaList: StudentProfileQnaListDomainSchema,
    teachingNoteListItem: StudentProfileTeachingNoteListItemDomainSchema,
    teachingNoteList: StudentProfileTeachingNoteListDomainSchema,
    studyRoomListItem: StudentProfileStudyRoomListItemDomainSchema,
    studyRoomList: StudentProfileStudyRoomListDomainSchema,
  },
  dashboard: {
    report: StudentDashboardReportShape,
    noteList: StudentDashboardNoteListShape,
    studyRoomList: StudentDashboardStudyRoomListShape,
    qnaList: StudentDashboardQnaListShape,
    homeworkList: StudentDashboardHomeworkListShape,
  },
};
