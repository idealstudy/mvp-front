import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 부모님 대시보드 학생 별 스터디룸 목록 조회
 * ────────────────────────────────────────────────────*/
const ParentDashboardConnectedStudyRoomDtoSchema = z.object({
  studyRoomId: z.number().int(),
  studyRoomName: z.string(),
});

const ParentDashboardConnectedStudentListDtoSchema = z.object({
  studentId: z.number().int(),
  studentName: z.string(),
  studyRooms: z.array(ParentDashboardConnectedStudyRoomDtoSchema),
});

/* ─────────────────────────────────────────────────────
 * 부모님 대시보드 활동 통계 조회
 * ────────────────────────────────────────────────────*/
const ParentDashboardReportDtoSchema = z.object({
  studyNews: z.number().int(),
  waitingInquiries: z.number().int(),
  answeredInquiries: z.number().int(),
  myStudentCount: z.number().int(),
});

/* ─────────────────────────────────────────────────────
 * 부모님 대시보드 아이템 공통
 * ────────────────────────────────────────────────────*/
const ParentDashboardListBaseDtoSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
});

/* ─────────────────────────────────────────────────────
 * 부모님 대시보드 학습 소식 목록 조회
 * ────────────────────────────────────────────────────*/
const ParentDashboardStudyNewsBaseItemDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  regDate: z.string(),
  teacherName: z.string(),
  studyRoomName: z.string(),
});

const ParentDashboardStudyNewsHomeworkItemDtoSchema =
  ParentDashboardStudyNewsBaseItemDtoSchema.extend({
    type: z.literal('HOMEWORK'),
    deadline: z.string(),
    deadlineLabel: z.enum(['UPCOMING', 'TODAY', 'OVERDUE']),
    dday: z.number(),
  });

const ParentDashboardStudyNewsTeachingNoteItemDtoSchema =
  ParentDashboardStudyNewsBaseItemDtoSchema.extend({
    type: z.literal('TEACHING_NOTE'),
  });

const ParentDashboardStudyNewsQnaItemDtoSchema =
  ParentDashboardStudyNewsBaseItemDtoSchema.extend({
    type: z.literal('QNA'),
    status: z.enum(['PENDING', 'COMPLETED']),
  });

const ParentDashboardStudyNewsItemDtoSchema = z.discriminatedUnion('type', [
  ParentDashboardStudyNewsHomeworkItemDtoSchema,
  ParentDashboardStudyNewsTeachingNoteItemDtoSchema,
  ParentDashboardStudyNewsQnaItemDtoSchema,
]);

const ParentDashboardStudyNewsListDtoSchema =
  ParentDashboardListBaseDtoSchema.extend({
    content: z.array(ParentDashboardStudyNewsItemDtoSchema),
  });

/* ─────────────────────────────────────────────────────
 * 부모님 대시보드 학습 일지 목록 조회
 * ────────────────────────────────────────────────────*/
const ParentDashboardConsultationListItemDtoSchema = z.object({
  id: z.number().int(),
  contentPreview: z.string(),
  regDate: z.string(),
});

const ParentDashboardConsultationListDtoSchema =
  ParentDashboardListBaseDtoSchema.extend({
    content: z.array(ParentDashboardConsultationListItemDtoSchema),
  });

/* ─────────────────────────────────────────────────────
 * 부모님 대시보드 스터디룸 둘러보기
 * ────────────────────────────────────────────────────*/
const ParentDashboardStudyRoomPreviewListItemDtoSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  teacherId: z.number().int(),
  teacherName: z.string(),
  subjectType: z.enum(['KOREAN', 'ENGLISH', 'MATH', 'OTHER']),
});

const ParentDashboardStudyRoomPreviewListDtoSchema =
  ParentDashboardListBaseDtoSchema.extend({
    content: z.array(ParentDashboardStudyRoomPreviewListItemDtoSchema),
  });

/* ─────────────────────────────────────────────────────
 * 부모님 대시보드 문의 목록 조회
 * ────────────────────────────────────────────────────*/
const ParentDashboardInquiryListItemDtoSchema = z.object({
  id: z.number().int(),
  teacherId: z.number().int(),
  teacherName: z.string(),
  title: z.string(),
  status: z.enum(['PENDING', 'COMPLETED']),
  regDate: z.string(),
});

const ParentDashboardInquiryListDtoSchema = z.object({
  content: z.array(ParentDashboardInquiryListItemDtoSchema),
});

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const dto = {
  dashboard: {
    report: ParentDashboardReportDtoSchema,
    connectedStudentList: ParentDashboardConnectedStudentListDtoSchema,
    studyNewsList: ParentDashboardStudyNewsListDtoSchema,
    consultationList: ParentDashboardConsultationListDtoSchema,
    studyRoomPreviewList: ParentDashboardStudyRoomPreviewListDtoSchema,
    inquiryList: ParentDashboardInquiryListDtoSchema,
  },
};
