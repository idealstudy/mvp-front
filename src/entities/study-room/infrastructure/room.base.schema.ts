import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 기본 enum / 값 객체
 * ────────────────────────────────────────────────────*/
export const RoomVisibilitySchema = z.enum(['PRIVATE', 'PUBLIC']);

export const RoomModalitySchema = z.enum(['ONLINE', 'OFFLINE']);

export const RoomClassFormSchema = z.enum(['ONE_ON_ONE', 'ONE_TO_MANY']);

export const RoomSubjectSchema = z.enum(['KOREAN', 'ENGLISH', 'MATH', 'OTHER']);

export const SchoolLevelSchema = z.enum(['ELEMENTARY', 'MIDDLE', 'HIGH']);

export const SchoolInfoSchema = z.object({
  schoolLevel: SchoolLevelSchema,
  grade: z.number().int().min(1).max(12),
});

/* ─────────────────────────────────────────────────────
 * Room DTO(백엔드 원본)
 * ────────────────────────────────────────────────────*/
export const RoomSchema = z.object({
  id: z.number().int().nonnegative(),
  teacherId: z.number().int().nonnegative(),
  name: z.string(),
  description: z.string(),
  visibility: RoomVisibilitySchema,
  thumbnailUrl: z.string().nullish(),
});

export const base = {
  schema: RoomSchema,
  visibility: RoomVisibilitySchema,
  modality: RoomModalitySchema,
  classForm: RoomClassFormSchema,
  schoolInfo: SchoolInfoSchema,
  subject: RoomSubjectSchema,
};
