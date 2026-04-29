import { z } from 'zod';

import { base } from '../infrastructure/room.base.schema';
import { dto } from '../infrastructure/room.dto.schema';

/* ─────────────────────────────────────────────────────
 * 기본 스터디룸 도메인(리스트/상세/학생/선생 공통)
 * ────────────────────────────────────────────────────*/
const RoomDomainSchema = base.schema.extend({
  numberOfTeachingNote: dto.states.shape.numberOfTeachingNote
    .optional()
    .default(0),
});

/* ─────────────────────────────────────────────────────
 * 선생님 스터디룸 리스트 / 상세페이지 도메인
 * ────────────────────────────────────────────────────*/
const TeacherRoomDomainSchema = RoomDomainSchema.extend({
  studentNames: dto.studentNames.shape.studentNames.default([]),
});

const TeacherRoomDetailDomainSchema = TeacherRoomDomainSchema.extend({
  teacherName: z.string().default(''),
  classForm: base.classForm.optional().default('ONE_ON_ONE'),
  subjectType: base.subject.optional().default('OTHER'),
  schoolInfo: base.schoolInfo.optional(),
  enrollmentStatus: z.enum(['OPEN', 'OPERATING']).optional(),
});

/* ─────────────────────────────────────────────────────
 * 학생용 스터디룸 리스트 / 상세페이지 도메인
 * (필요하면 별도로, 당장은 Room 그대로 써도됨)
 * ────────────────────────────────────────────────────*/
const StudentRoomDomainSchema = RoomDomainSchema;

const StudentRoomDetailDomainSchema = StudentRoomDomainSchema.extend({
  teacherName: z.string().default(''),
  modality: base.modality.optional().default('ONLINE'),
  classForm: base.classForm.optional().default('ONE_ON_ONE'),
  subjectType: base.subject.optional().default('OTHER'),
  schoolInfo: base.schoolInfo.optional(),
});

/* ─────────────────────────────────────────────────────
 * 도메인 객체 내보내기
 * ────────────────────────────────────────────────────*/
const teacher = {
  list: TeacherRoomDomainSchema,
  detail: TeacherRoomDetailDomainSchema,
};

const student = {
  list: StudentRoomDomainSchema,
  detail: StudentRoomDetailDomainSchema,
};

export const domain = {
  base: RoomDomainSchema,
  teacher,
  student,
};
