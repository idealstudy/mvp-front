import { domain } from '@/entities/profile/core';
import { dto } from '@/entities/profile/infrastructure';
import { z } from 'zod';

// DTO 타입
export type TeacherProfileDTO = z.infer<typeof dto.teacher>;
export type StudentProfileDTO = z.infer<typeof dto.stuent>;
export type ParentProfileDTO = z.infer<typeof dto.parent>;
export type ProfileDTO = z.infer<typeof dto.schema>;

// Role 타입
export type ProfileRole = z.infer<typeof dto.role>;

// Domain 타입
export type FrontendTeacherProfile = z.infer<typeof domain.teacher>;
export type FrontendStudentProfile = z.infer<typeof domain.student>;
export type FrontendParentProfile = z.infer<typeof domain.parent>;
export type FrontendProfile = z.infer<typeof domain.schema>;

export type ProfileWithMeta = FrontendProfile & {
  id: string;
  role: ProfileRole;
};
