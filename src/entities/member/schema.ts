import { z } from 'zod';

const MemberRoleSchema = z.enum([
  'ROLE_ADMIN',
  'ROLE_PARENT',
  'ROLE_TEACHER',
  'ROLE_STUDENT',
  'ROLE_MEMBER',
]);

const MemberSchema = z.object({
  id: z.number().int().nonnegative(),
  email: z.string().email(),
  password: z.string().optional(),
  name: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  // ISO: YYYY-MM-DD
  birthDate: z.string().optional().nullable(),
  agreeServiceTerms: z.boolean().optional().nullable(),
  agreeMarketing: z.boolean().optional().nullable(),
  agreeAgeCheck: z.boolean().optional().nullable(),
  agreePrivacyTerms: z.boolean().optional().nullable(),
  isProfilePublic: z.boolean().optional().nullable(),
  modNicknameDate: z.string().optional().nullable(),
  deletedAt: z.string().optional().nullable(),
  deleted: z.boolean().optional().nullable(),
  role: MemberRoleSchema,
  // ISO date-time
  regDate: z.string().optional().nullable(),
  modDate: z.string().optional().nullable(),
});

export const base = {
  role: MemberRoleSchema,
  schema: MemberSchema,
};
