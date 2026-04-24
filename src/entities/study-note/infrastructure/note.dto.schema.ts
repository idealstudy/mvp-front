import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 스터디 노트 DTO 스키마
 * ────────────────────────────────────────────────────*/
export const NoteVisibilitySchema = z.enum([
  'TEACHER_ONLY',
  'SPECIFIC_STUDENTS_ONLY',
  'SPECIFIC_STUDENTS_AND_PARENTS',
  'STUDY_ROOM_STUDENTS_ONLY',
  'STUDY_ROOM_STUDENTS_AND_PARENTS',
  'PUBLIC',
]);

const ResponseDateStringSchema = z.string();
const NullableResponseDateStringSchema = ResponseDateStringSchema.nullish();

export const StudentInfoSchema = z.object({
  studentId: z.number().int(),
  studentName: z.string(),
  readAt: ResponseDateStringSchema.nullable(),
});

/* ─────────────────────────────────────────────────────
 * 수업 노트 생성 및 수정 요청 본문 DTO
 * POST /api/teacher/teaching-notes
 * PUT /api/teacher/teaching-notes/{id}
 * ────────────────────────────────────────────────────*/
export const NoteRequestDTO = z.object({
  studyRoomId: z.number().int(),
  teachingNoteGroupId: z.number().int(),
  title: z.string().min(1, '제목은 필수입니다.'),
  content: z.string(),
  visibility: NoteVisibilitySchema,
  taughtAt: z.string().datetime(),
  studentIds: z.array(z.number().int()),
  imageIds: z.array(z.string()),
});

/* ─────────────────────────────────────────────────────
 * 전체 수업노트조회 응답의 개별 아이템 DTO(content 배열 내부)
 * GET /api/{role}/study-rooms/{studyRoomId}/teaching-notes
 * GET /api/{role}/study-rooms/{studyRoomId}/teaching-note-groups/{teachingNoteGroupId}/teaching-notes
 * ────────────────────────────────────────────────────*/
export const NoteListItemDTO = z.object({
  id: z.number().int(),
  groupId: z.number().int(),
  groupName: z.string(),
  teacherName: z.string(),
  title: z.string(),
  visibility: NoteVisibilitySchema,
  taughtAt: ResponseDateStringSchema,
  updatedAt: ResponseDateStringSchema,
});

/* ─────────────────────────────────────────────────────
 * 수업 노트 목록 조회 응답 DTO(Pagination 포함)
 * GET /api/{role}/study-rooms/{studyRoomId}/teaching-notes
 * GET /api/{role}/study-rooms/{studyRoomId}/teaching-notes
 * ────────────────────────────────────────────────────*/
export const NoteListResponseDataDTO = z.object({
  pageNumber: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  content: z.array(NoteListItemDTO),
});

/* ─────────────────────────────────────────────────────
 * 수업 노트 상세 내용 조회 응답 DTO
 * GET /api/public/teaching-notes/{teachingNoteId}
 * ────────────────────────────────────────────────────*/
const ResolvedContentDTO = z.object({
  content: z.string(),
  imgExpiresAt: NullableResponseDateStringSchema,
  expiresAt: NullableResponseDateStringSchema,
});

export const NoteDetailDTO = z.object({
  id: z.number().int(),
  studyRoomId: z.number().int(),
  studyRoomName: z.string(),
  groupId: z.number().int(),
  title: z.string(),
  content: z.string(),
  resolvedContent: ResolvedContentDTO,
  taughtAt: ResponseDateStringSchema,
  visibility: NoteVisibilitySchema,
  studentInfos: z.array(StudentInfoSchema),
});

/* ─────────────────────────────────────────────────────
 * 보호자 - 수업 노트 상세 내용 조회 응답 DTO
 * GET /api/parent/student/{studentId}/teaching-notes/{teachingNoteId}
 * ────────────────────────────────────────────────────*/
const ParentResolvedContentDTO = z.object({
  content: z.string(),
  expiresAt: NullableResponseDateStringSchema,
  imgExpiresAt: NullableResponseDateStringSchema,
});

const ParentStudentInfosDto = z.object({
  studentId: z.number().int(),
  studentName: z.string(),
  readAt: ResponseDateStringSchema.nullable(),
});

export const ParentNoteDetailDTO = z.object({
  id: z.number().int(),
  studyRoomId: z.number().int(),
  studyRoomName: z.string(),
  groupId: z.number().int().nullable(),
  title: z.string(),
  content: z.string(),
  resolvedContent: ParentResolvedContentDTO,
  taughtAt: ResponseDateStringSchema,
  visibility: NoteVisibilitySchema,
  studentInfos: z.array(ParentStudentInfosDto),
});

export const dto = {
  request: NoteRequestDTO,
  detail: NoteDetailDTO,
  listItem: NoteListItemDTO,
  listData: NoteListResponseDataDTO,
  visibility: NoteVisibilitySchema,
  studentInfo: StudentInfoSchema,
  parentDetail: ParentNoteDetailDTO,
};
