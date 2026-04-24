import { domain } from '@/entities/homework/core/homework.domain';
import { dto, payload } from '@/entities/homework/infrastructure/homework.dto';
import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * DTO (Response)
 * ────────────────────────────────────────────────────*/
export type HomeworkSortKeyDTO = z.infer<typeof dto.enums.sortKey>;
export type HomeworkReminderOffsetDTO = z.infer<
  typeof dto.enums.reminderOffset
>;
export type HomeworkSubmitStatusDTO = z.infer<typeof dto.enums.submitStatus>;
export type HomeworkDeadlineLabelDTO = z.infer<typeof dto.enums.deadlineLabel>;

export type HomeworkSubmissionDTO = z.infer<typeof dto.common.submission>;
export type HomeworkFeedbackDTO = z.infer<typeof dto.common.feedback>;
export type HomeworkListItemBaseDTO = z.infer<
  typeof dto.common.homeworkListItemBase
>;
export type HomeworkDetailDTO = z.infer<typeof dto.common.homeworkDetail>;

export type TeacherHomeworkListItemDTO = z.infer<typeof dto.teacher.listItem>;
export type TeacherHomeworkListPageDTO = z.infer<typeof dto.teacher.listPage>;
export type TeacherHomeworkDetailDTO = z.infer<typeof dto.teacher.detail>;
export type TeacherHomeworkDetailInputDTO = z.input<typeof dto.teacher.detail>;
export type TeacherHomeworkStudentItemDTO = z.infer<
  typeof dto.teacher.homeworkStudentItem
>;

export type StudentHomeworkListItemDTO = z.infer<typeof dto.student.listItem>;
export type StudentHomeworkListPageDTO = z.infer<typeof dto.student.listPage>;
export type StudentHomeworkDetailDTO = z.infer<typeof dto.student.detail>;
export type StudentHomeworkDetailInputDTO = z.input<typeof dto.student.detail>;
export type MyHomeworkStudentDTO = z.infer<
  typeof dto.student.myHomeworkStudent
>;
export type OtherHomeworkStudentDTO = z.infer<
  typeof dto.student.otherHomeworkStudent
>;
export type ParentHomeworkDetailDTO = z.infer<typeof dto.parent.detail>;
export type ParentHomeworkDetailInputDTO = z.input<typeof dto.parent.detail>;
export type ParentHomeworkStudentDTO = z.infer<
  typeof dto.parent.myHomeworkStudent
>;

/* ─────────────────────────────────────────────────────
 * Payload (Request)
 * ────────────────────────────────────────────────────*/
export type TeacherHomeworkCUPayload = z.infer<typeof payload.teacherCuRequest>;
export type HomeworkContentPayload = z.infer<typeof payload.contentRequest>;
export type HomeworkListQueryPayload = z.infer<typeof payload.listQuery>;

/* ─────────────────────────────────────────────────────
 * FE 타입 (legacy model 대체)
 * ────────────────────────────────────────────────────*/
export interface PageableResponse<T> {
  pageNumber: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: T[];
}

export type HomeworkSortKey = HomeworkSortKeyDTO;
export type ReminderOffset = HomeworkReminderOffsetDTO;
export type HomeworkSubmitStatus = HomeworkSubmitStatusDTO;
export type HomeworkLimit = 20 | 30;
export type HomeworkPageable = HomeworkListQueryPayload;

export type Homework = HomeworkListItemBaseDTO;
export type TeacherHomeworkItem = TeacherHomeworkListItemDTO;
export type StudentHomeworkItem = StudentHomeworkListItemDTO;

export type TeacherHomeworkRequest = TeacherHomeworkCUPayload;

export type HomeworkDetail = z.infer<typeof dto.common.homeworkDetail>;
export type HomeworkStudentItem = z.infer<
  typeof dto.teacher.homeworkStudentItem
>;
export type TeacherHomeworkDetailData = z.infer<typeof domain.teacher.detail>;
export type MyHomeworkStudent = z.infer<
  typeof domain.student.detail
>['myHomeworkStudent'];
export type OtherHomeworkStudent = z.infer<
  typeof domain.student.detail
>['otherHomeworkStudents'][number];
export type StudentHomeworkDetailData = z.infer<typeof domain.student.detail>;
export type ParentHomeworkDetailData = z.infer<typeof domain.parent.detail>;
