import { z } from 'zod';

export const ROLES = ['ROLE_STUDENT', 'ROLE_TEACHER', 'ROLE_PARENT'] as const;
export type Role = (typeof ROLES)[number];
export const Role = z.enum(ROLES);

export type Session = z.infer<typeof Session>;
export const Session = z.object({
  auth: Role,
  nickname: z.string().optional(),
});

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginResponse = z.infer<typeof LoginResponse>;
export const LoginResponse = z.object({
  token: z.string(),
});

export type CheckEmailDuplicateBody = {
  email: string;
};

export type SendVerificationCodeBody = {
  email: string;
};

export type VerifyCodeBody = {
  email: string;
  code: string;
};

export type SignUpBody = {
  email: string;
  password: string;
  name: string;
  acceptOptionalTerm: boolean;
  role: Role;
};
