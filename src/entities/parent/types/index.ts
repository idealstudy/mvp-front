import { domain } from '@/entities/parent/core';
import { dto, payload } from '@/entities/parent/infrastructure/parent.dto';
import { z } from 'zod';

/*
 * DTO
 */
export type ParentBasicInfoDTO = z.infer<typeof dto.mypage.basicInfo>;

export type ParentDashboardConnectedStudentListDTO = z.infer<
  typeof dto.dashboard.connectedStudentList
>;
export type ParentDashboardReportDTO = z.infer<typeof dto.dashboard.report>;

export type ParentDashboardStudyNewsListDTO = z.infer<
  typeof dto.dashboard.studyNewsList
>;
export type ParentDashboardStudyNewsItemDTO =
  ParentDashboardStudyNewsListDTO['content'][number];

export type ParentDashboardConsultationListDTO = z.infer<
  typeof dto.dashboard.consultationList
>;
export type ParentDashboardConsultationItemDTO =
  ParentDashboardConsultationListDTO['content'][number];

export type ParentDashboardStudyRoomPreviewListDTO = z.infer<
  typeof dto.dashboard.studyRoomPreviewList
>;

export type ParentDashboardInquiryListDTO = z.infer<
  typeof dto.dashboard.inquiryList
>;

/*
 * Domain
 */
export type FrontendParentBasicInfo = z.infer<typeof domain.basicInfo>;

/*
 * Payload
 */
export type UpdateParentBasicInfoPayload = z.infer<
  typeof payload.updateBasicInfo
>;
