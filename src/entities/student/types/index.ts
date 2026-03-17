import { domain } from '@/entities/student/core/student.domain';
import { dto, payload } from '@/entities/student/infrastructure/student.dto';
import { z } from 'zod';

export type DashboardTeachingNotesSortKey =
  | 'LATEST_EDITED'
  | 'OLDEST_EDITED'
  | 'TITLE_ASC'
  | 'TAUGHT_AT_ASC';
export type DashboardQnASortKey = 'LATEST' | 'OLDEST' | 'ALPHABETICAL';
export type DashboardHomeworkSortKey =
  | 'LATEST'
  | 'LATEST_EDITED'
  | 'OLDEST_EDITED'
  | 'DEADLINE_IMMINENT'
  | 'DEADLINE_RECENT';

/* ─────────────────────────────────────────────────────
 * DTO
 * ────────────────────────────────────────────────────*/
// 프로필 DTO
export type StudentBasicInfoDTO = z.infer<typeof dto.profile.basicInfo>;
export type StudentReportDTO = z.infer<typeof dto.profile.report>;

// 대시보드 DTO
export type StudentDashboardReportDTO = z.infer<typeof dto.dashboard.report>;
export type StudentDashboardNoteListDTO = z.infer<
  typeof dto.dashboard.noteList
>;
export type StudentDashboardStudyRoomListDTO = z.infer<
  typeof dto.dashboard.studyRoomList
>;
export type StudentDashboardQnaListDTO = z.infer<typeof dto.dashboard.qnaList>;
export type StudentDashboardHomeworkListDTO = z.infer<
  typeof dto.dashboard.homeworkList
>;

export type StudentDashboardNoteListItemDTO =
  StudentDashboardNoteListDTO['content'][number];
export type StudentDashboardStudyRoomListItemDTO =
  StudentDashboardStudyRoomListDTO[number];
export type StudentDashboardQnaListItemDTO =
  StudentDashboardQnaListDTO['content'][number];
export type StudentDashboardHomeworkListItemDTO =
  StudentDashboardHomeworkListDTO['content'][number];

/* ─────────────────────────────────────────────────────
 * Domain
 * ────────────────────────────────────────────────────*/
export type FrontendStudentBasicInfo = z.infer<typeof domain.profile.basicInfo>;
export type FrontendStudentReport = z.infer<typeof domain.profile.report>;

/* ─────────────────────────────────────────────────────
 * Payload
 * ────────────────────────────────────────────────────*/
export type UpdateStudentBasicInfoPayload = z.infer<
  typeof payload.updateBasicInfo
>;
