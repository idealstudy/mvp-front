import { domain } from '@/entities/teacher/core/teacher.domain';
import { dto, payload } from '@/entities/teacher/infrastructure/teacher.dto';
import { z } from 'zod';

export type DashboardTeachingNotesSortKey =
  | 'LATEST_EDITED'
  | 'OLDEST_EDITED'
  | 'TITLE_ASC'
  | 'TAUGHT_AT_ASC';
export type DashboardQnASortKey = 'LATEST' | 'OLDEST' | 'ALPHABETICAL';
export type DashboardMemberSortKey = 'LATEST' | 'OLDEST' | 'ALPHABETICAL';
export type DashboardHomeworkSortKey =
  | 'LATEST'
  | 'LATEST_EDITED'
  | 'OLDEST_EDITED'
  | 'DEADLINE_IMMINENT'
  | 'DEADLINE_RECENT';

export type TeacherReportDTO = z.infer<typeof dto.teacherReport>;
export type TeacherNoteListDTO = z.infer<typeof dto.teacherNoteList>;
export type TeacherStudyRoomListDTO = z.infer<typeof dto.teacherStudyRoomList>;

export type TeacherNoteListItemDTO = TeacherNoteListDTO[number];
export type TeacherStudyRoomListItemDTO = TeacherStudyRoomListDTO[number];

// 대시보드 DTO
export type TeacherDashboardReportDTO = z.infer<typeof dto.dashboard.report>;
export type TeacherDashboardNoteListDTO = z.infer<
  typeof dto.dashboard.noteList
>;
export type TeacherDashboardStudyRoomListDTO = z.infer<
  typeof dto.dashboard.studyRoomList
>;
export type TeacherDashboardQnaListDTO = z.infer<typeof dto.dashboard.QnaList>;
export type TeacherDashboardMemberListDTO = z.infer<
  typeof dto.dashboard.memberList
>;
export type TeacherDashboardHomeworkListDTO = z.infer<
  typeof dto.dashboard.homeworkList
>;

export type TeacherDashboardNoteListItemDTO =
  TeacherDashboardNoteListDTO['content'][number];
export type TeacherDashboardStudyRoomListItemDTO =
  TeacherDashboardStudyRoomListDTO[number];
export type TeacherDashboardQnaListItemDTO =
  TeacherDashboardQnaListDTO['content'][number];
export type TeacherDashboardMemberListItemDTO =
  TeacherDashboardMemberListDTO['content'][number];
export type TeacherDashboardHomeworkListItemDTO =
  TeacherDashboardHomeworkListDTO['content'][number];

export type TeacherBasicInfoDTO = z.infer<typeof dto.basicInfo>;

export type FrontendTeacherBasicInfo = z.infer<typeof domain.basicInfo>;

export type UpdateTeacherBasicInfoPayload = z.infer<
  typeof payload.updateBasicInfo
>;
