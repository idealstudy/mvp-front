import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 공통 enum
 * ────────────────────────────────────────────────────*/
const HomeworkSortKeySchema = z.enum([
  'DEADLINE_IMMINENT',
  'DEADLINE_RECENT',
  'LATEST_EDITED',
  'OLDEST_EDITED',
]);

const ReminderOffsetSchema = z.enum(['HOUR_1', 'HOUR_3', 'DAY_1']);

const HomeworkSubmitStatusSchema = z.enum([
  'NOT_SUBMIT',
  'SUBMIT',
  'LATE_SUBMIT',
]);

const HomeworkDeadlineLabelSchema = z.enum(['UPCOMING', 'TODAY', 'OVERDUE']);

/* ─────────────────────────────────────────────────────
 * 공통 서브 스키마
 * ────────────────────────────────────────────────────*/
const ResolvedEditorContentSchema = z.object({
  content: z.string(),
});

const OptionalResolvedEditorContentSchema =
  ResolvedEditorContentSchema.nullable()
    .optional()
    .transform((value) => value ?? undefined);

const HomeworkSubmissionSchema = z.object({
  content: z.string(),
  resolvedContent: OptionalResolvedEditorContentSchema,
  modifiedSubmissionAt: z.string(),
});

const HomeworkFeedbackSchema = z.object({
  content: z.string(),
  resolvedContent: OptionalResolvedEditorContentSchema,
  modifiedFeedbackAt: z.string(),
});

const OptionalHomeworkSubmissionSchema = HomeworkSubmissionSchema.nullable()
  .optional()
  .transform((value) => value ?? undefined);

const OptionalHomeworkFeedbackSchema = HomeworkFeedbackSchema.nullable()
  .optional()
  .transform((value) => value ?? undefined);

const HomeworkListItemBaseSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  modDate: z.string(),
  deadline: z.string(),
  deadlineLabel: HomeworkDeadlineLabelSchema,
  dday: z.number().int(),
});

const HomeworkDetailSchema = z.object({
  id: z.number().int(),
  teacherName: z.string(),
  title: z.string(),
  content: z.string(),
  resolvedContent: OptionalResolvedEditorContentSchema,
  deadline: z.string(),
  modifiedAt: z.string(),
  reminderOffsets: z.array(ReminderOffsetSchema),
  teachingNoteInfoList: z.array(
    z.object({
      id: z.number().int(),
      name: z.string(),
    })
  ),
});

const createPageableContentSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    pageNumber: z.number().int(),
    size: z.number().int(),
    totalElements: z.number().int(),
    totalPages: z.number().int(),
    content: z.array(itemSchema),
  });

/* ─────────────────────────────────────────────────────
 * 선생님 - 응답 DTO
 * ────────────────────────────────────────────────────*/
const TeacherHomeworkListItemSchema = HomeworkListItemBaseSchema.extend({
  submittedCount: z.number().int(),
  totalStudentCount: z.number().int(),
  submittedRatePercent: z.number(),
});

const HomeworkStudentItemSchema = z.object({
  id: z.number().int(),
  studentName: z.string(),
  studentId: z.number().int(),
  status: HomeworkSubmitStatusSchema,
  submission: OptionalHomeworkSubmissionSchema,
  feedback: OptionalHomeworkFeedbackSchema,
});

const TeacherHomeworkDetailDataSchema = z.object({
  homework: HomeworkDetailSchema,
  homeworkStudents: z.array(HomeworkStudentItemSchema),
});

/* ─────────────────────────────────────────────────────
 * 학생 - 응답 DTO
 * ────────────────────────────────────────────────────*/
const StudentHomeworkListItemSchema = HomeworkListItemBaseSchema.extend({
  status: HomeworkSubmitStatusSchema,
});

const MyHomeworkStudentSchema = z.object({
  id: z.number().int(),
  studentName: z.string(),
  status: HomeworkSubmitStatusSchema,
  submission: OptionalHomeworkSubmissionSchema,
  feedback: OptionalHomeworkFeedbackSchema,
});

const OtherHomeworkStudentSchema = z.object({
  studentName: z.string(),
  status: HomeworkSubmitStatusSchema,
  modifiedSubmissionAt: z.string().nullable(),
  modifiedFeedbackAt: z.string().nullable(),
});

const StudentHomeworkDetailDataSchema = z.object({
  homework: HomeworkDetailSchema,
  myHomeworkStudent: MyHomeworkStudentSchema,
  otherHomeworkStudents: z.array(OtherHomeworkStudentSchema),
});

/* ─────────────────────────────────────────────────────
 * 요청 payload 스키마
 * ────────────────────────────────────────────────────*/
const TeacherHomeworkCURequestSchema = z.object({
  title: z.string(),
  content: z.string(),
  deadline: z.string(),
  reminderOffsets: z.array(ReminderOffsetSchema).optional(),
  teachingNoteIds: z.array(z.number().int()).optional(),
  studentIds: z.array(z.number().int()).optional(),
  mediaIds: z.array(z.string()).optional(),
});

const HomeworkContentRequestSchema = z.object({
  content: z.string(),
});

const HomeworkListQuerySchema = z.object({
  page: z.number().int(),
  size: z.union([z.literal(20), z.literal(30)]),
  sortKey: HomeworkSortKeySchema.optional(),
  keyword: z.string().optional(),
});

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
const teacher = {
  listItem: TeacherHomeworkListItemSchema,
  listPage: createPageableContentSchema(TeacherHomeworkListItemSchema),
  detail: TeacherHomeworkDetailDataSchema,
  homeworkStudentItem: HomeworkStudentItemSchema,
};

const student = {
  listItem: StudentHomeworkListItemSchema,
  listPage: createPageableContentSchema(StudentHomeworkListItemSchema),
  detail: StudentHomeworkDetailDataSchema,
  myHomeworkStudent: MyHomeworkStudentSchema,
  otherHomeworkStudent: OtherHomeworkStudentSchema,
};

const common = {
  resolvedContent: ResolvedEditorContentSchema,
  submission: HomeworkSubmissionSchema,
  feedback: HomeworkFeedbackSchema,
  homeworkListItemBase: HomeworkListItemBaseSchema,
  homeworkDetail: HomeworkDetailSchema,
};

const enums = {
  sortKey: HomeworkSortKeySchema,
  reminderOffset: ReminderOffsetSchema,
  submitStatus: HomeworkSubmitStatusSchema,
  deadlineLabel: HomeworkDeadlineLabelSchema,
};

export const dto = {
  teacher,
  student,
  common,
  enums,
};

export const payload = {
  teacherCuRequest: TeacherHomeworkCURequestSchema,
  contentRequest: HomeworkContentRequestSchema,
  listQuery: HomeworkListQuerySchema,
};
