import { domain } from '@/entities/teacher/core/teacher.domain';
import {
  dto,
  payload,
  query,
} from '@/entities/teacher/infrastructure/teacher.dto';
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

/* ─────────────────────────────────────────────────────
 * DTO
 * ────────────────────────────────────────────────────*/
export type TeacherdescriptionDTO = z.infer<typeof dto.teacherDescription>;
export type TeacherReportDTO = z.infer<typeof dto.teacherReport>;
export type TeacherNoteListDTO = z.infer<typeof dto.teacherNoteList>;
export type TeacherStudyRoomListDTO = z.infer<typeof dto.teacherStudyRoomList>;
export type TeacherBasicInfoDTO = z.infer<typeof dto.basicInfo>;
export type TeacherRepresentativeNoteListDTO = z.infer<
  typeof dto.teacherRepresentativeNoteList
>;
export type TeacherReviewListDTO = z.infer<typeof dto.teacherReviewList>;
export type TeacherCareerListDTO = z.infer<typeof dto.teacherCareerList>;

export type TeacherNoteListItemDTO = TeacherNoteListDTO['content'][number];
export type TeacherStudyRoomListItemDTO = TeacherStudyRoomListDTO[number];

// 대시보드 DTO
export type TeacherDashboardReportDTO = z.infer<typeof dto.dashboard.report>;
export type TeacherDashboardNoteListDTO = z.infer<
  typeof dto.dashboard.noteList
>;
export type TeacherDashboardStudyRoomListDTO = z.infer<
  typeof dto.dashboard.studyRoomList
>;
export type TeacherDashboardQnaListDTO = z.infer<typeof dto.dashboard.qnaList>;
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

/* ─────────────────────────────────────────────────────
 * Domain
 * ────────────────────────────────────────────────────*/
export type FrontendTeacherBasicInfo = z.infer<typeof domain.basicInfo>;
export type FrontendTeacherDescription = z.infer<
  typeof domain.teacherDescription
>;
export type FrontendTeacherReport = z.infer<typeof domain.teacherReport>;
export type FrontendTeacherNoteListItem = z.infer<
  typeof domain.teacherNoteListItem
>;
export type FrontendTeacherNoteList = z.infer<typeof domain.teacherNoteList>;
export type FrontendTeacherRepresentativeNoteList = z.infer<
  typeof domain.teacherRepresentativeNoteList
>;
export type FrontendTeacherStudyRoomListItem = z.infer<
  typeof domain.teacherStudyRoomListItem
>;
export type FrontendTeacherStudyRoomList = z.infer<
  typeof domain.teacherStudyRoomList
>;
export type FrontendTeacherReviewListItem = z.infer<
  typeof domain.teacherReviewListItem
>;
export type FrontendTeacherReviewList = z.infer<
  typeof domain.teacherReviewList
>;
export type FrontendTeacherCareerListItem = z.infer<
  typeof domain.teacherCareerListItem
>;
export type FrontendTeacherCareerList = z.infer<
  typeof domain.teacherCareerList
>;

/* ─────────────────────────────────────────────────────
 * Payload
 * ────────────────────────────────────────────────────*/
export type UpdateTeacherBasicInfoPayload = z.infer<typeof payload.basicInfo>;
export type UpdateTeacherDescriptionPayload = z.infer<
  typeof payload.description
>;
export type UpdateTeacherTeachingNoteRepresentativePayload = z.infer<
  typeof payload.teachingNoteRepresentative
>;
export type CareerPayload = z.infer<typeof payload.career>;

/* ─────────────────────────────────────────────────────
 * Query
 * ────────────────────────────────────────────────────*/
export type ReviewListQuery = z.infer<typeof query.teacherReviewList>;
export type NoteListQuery = z.infer<typeof query.teacherNoteList>;
