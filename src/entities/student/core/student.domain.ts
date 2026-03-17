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
  },
  dashboard: {
    report: StudentDashboardReportShape,
    noteList: StudentDashboardNoteListShape,
    studyRoomList: StudentDashboardStudyRoomListShape,
    qnaList: StudentDashboardQnaListShape,
    homeworkList: StudentDashboardHomeworkListShape,
  },
};
