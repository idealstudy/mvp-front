import { dto } from '../infrastructure/homework.dto';

/* ─────────────────────────────────────────────────────
 * 공통 정규화 헬퍼
 * - 백엔드 nullable 필드를 프론트 optional로 정리
 * ────────────────────────────────────────────────────*/
const normalizeResolvedContent = <
  T extends { resolvedContent?: { content: string } | null },
>(
  target: T
): Omit<T, 'resolvedContent'> & { resolvedContent?: { content: string } } => ({
  ...target,
  resolvedContent: target.resolvedContent ?? undefined,
});

/* ─────────────────────────────────────────────────────
 * Teacher Detail Domain
 * ────────────────────────────────────────────────────*/
const TeacherHomeworkDetailSchema = dto.teacher.detail.transform((data) => ({
  ...data,
  homework: normalizeResolvedContent(data.homework),
  homeworkStudents: data.homeworkStudents.map((student) => ({
    ...student,
    submission: student.submission
      ? normalizeResolvedContent(student.submission)
      : undefined,
    feedback: student.feedback
      ? normalizeResolvedContent(student.feedback)
      : undefined,
  })),
}));

/* ─────────────────────────────────────────────────────
 * Student Detail Domain
 * ────────────────────────────────────────────────────*/
const StudentHomeworkDetailSchema = dto.student.detail.transform((data) => ({
  ...data,
  homework: normalizeResolvedContent(data.homework),
  myHomeworkStudent: {
    ...data.myHomeworkStudent,
    submission: data.myHomeworkStudent.submission
      ? normalizeResolvedContent(data.myHomeworkStudent.submission)
      : undefined,
    feedback: data.myHomeworkStudent.feedback
      ? normalizeResolvedContent(data.myHomeworkStudent.feedback)
      : undefined,
  },
}));

/* ─────────────────────────────────────────────────────
 * Parent Detail Domain
 * ────────────────────────────────────────────────────*/
const ParentHomeworkDetailSchema = dto.parent.detail.transform((data) => ({
  ...data,
  homework: normalizeResolvedContent(data.homework),
  myHomeworkStudent: {
    ...data.myHomeworkStudent,
    submission: data.myHomeworkStudent.submission
      ? normalizeResolvedContent(data.myHomeworkStudent.submission)
      : undefined,
    feedback: data.myHomeworkStudent.feedback
      ? normalizeResolvedContent(data.myHomeworkStudent.feedback)
      : undefined,
  },
}));

/* ─────────────────────────────────────────────────────
 * Domain export
 * - 현재 list는 DTO 그대로 사용
 * - 이후 dday / deadlineLabel 계산이 필요하면 listItem/listPage transform 추가
 * ────────────────────────────────────────────────────*/
export const domain = {
  teacher: {
    listItem: dto.teacher.listItem,
    listPage: dto.teacher.listPage,
    detail: TeacherHomeworkDetailSchema,
  },
  student: {
    listItem: dto.student.listItem,
    listPage: dto.student.listPage,
    detail: StudentHomeworkDetailSchema,
  },
  parent: {
    detail: ParentHomeworkDetailSchema,
  },
};
