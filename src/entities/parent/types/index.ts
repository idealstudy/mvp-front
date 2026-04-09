import { dto } from '@/entities/parent/infrastructure/parent.dto';
import { z } from 'zod';

/*
 * DTO
 */
export type ParentDashboardConnectedStudentListDTO = z.infer<
  typeof dto.dashboard.connectedStudentList
>;
export type ParentDashboardReportDTO = z.infer<typeof dto.dashboard.report>;
export type ParentDashboardStudyNewsListDTO = z.infer<
  typeof dto.dashboard.studyNewsList
>;
export type ParentDashboardConsultationListDTO = z.infer<
  typeof dto.dashboard.consultationList
>;
export type ParentDashboardStudyRoomPreviewListDTO = z.infer<
  typeof dto.dashboard.studyRoomPreviewList
>;
export type ParentDashboardInquiryListDTO = z.infer<
  typeof dto.dashboard.inquiryList
>;
