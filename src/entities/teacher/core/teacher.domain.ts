import { dto } from '@/entities/teacher/infrastructure/teacher.dto';
import { z } from 'zod';

/**
 * 선생님 기본 정보 Domain 스키마
 */
const BasicInfoDomainSchema = z.object({
  name: z.string(),
  email: z.string(),
  isProfilePublic: z.boolean(),
  simpleIntroduction: z.string(),
  role: z.literal('ROLE_TEACHER'),
  profilePublicKorean: z.enum(['공개', '비공개']),
});

const TeacherReportDomainSchema = z.object({
  studyRoomCount: z.number(),
  teachingNoteCount: z.number(),
  studentCount: z.number(),
  qnaCount: z.number(),
  reviewCount: z.number(),
});

const TeacherNoteListDomainSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    studyRoomId: z.number(),
    studyRoomName: z.string(),
    qnaCount: z.number(),
    viewCount: z.number(),
    modDate: z.string(),
    representative: z.boolean(),
  })
  .array();

const TeacherDashboardReportShape = dto.dashboard.report;
const TeacherDashboardNoteListShape = dto.dashboard.noteList;
const TeacherDashboardStudyRoomListShape = dto.dashboard.studyRoomList;
const TeacherDashboardQnaListShape = dto.dashboard.QnaList;
const TeacherDashboardMemberListShape = dto.dashboard.memberList;
const TeacherDashboardHomeworkListShape = dto.dashboard.homeworkList;

const TeacherStudyRoomListDomainSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    teachingNoteCount: z.number(),
    studentCount: z.number(),
    qnaCount: z.number(),
  })
  .array();

/**
 * 내보내기
 */
export const domain = {
  basicInfo: BasicInfoDomainSchema,
  teacherReport: TeacherReportDomainSchema,
  teacherNoteList: TeacherNoteListDomainSchema,
  teacherStudyRoomList: TeacherStudyRoomListDomainSchema,
  dashboard: {
    report: TeacherDashboardReportShape,
    noteList: TeacherDashboardNoteListShape,
    studyRoomList: TeacherDashboardStudyRoomListShape,
    QnaList: TeacherDashboardQnaListShape,
    memberList: TeacherDashboardMemberListShape,
    homeworkList: TeacherDashboardHomeworkListShape,
  },
};
