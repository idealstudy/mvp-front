import { z } from 'zod';

const NullableProfileImageUrlSchema = z
  .string()
  .nullable()
  .optional()
  .transform((value) => value ?? null);

// ADMIN, MEMBER 제외
const ProfileRoleSchema = z.enum([
  'ROLE_TEACHER',
  'ROLE_STUDENT',
  'ROLE_PARENT',
]);

const TeacherProfileSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  profileImageUrl: NullableProfileImageUrlSchema,
  desc: z.string(),
  teacherNoteCount: z.number().int(),
  studentCount: z.number().int(),
  reviewCount: z.number().int(),
});

const StudentProfileSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  profileImageUrl: NullableProfileImageUrlSchema,
  desc: z.string(),
});

const ParentProfileSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  profileImageUrl: NullableProfileImageUrlSchema,
});

export const base = {
  role: ProfileRoleSchema,
  teacher: TeacherProfileSchema,
  student: StudentProfileSchema,
  parent: ParentProfileSchema,
};
