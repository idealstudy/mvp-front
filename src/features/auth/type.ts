import { ApiResponse } from '@/lib/api';
import { z } from 'zod';

export type Role = (typeof ROLES)[number];
export const ROLES = ['ROLE_STUDENT', 'ROLE_TEACHER', 'ROLE_PARENT'] as const;

export type JWT = {
  auth: Role;
  exp: number;
  sub: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginResponse = z.infer<typeof LoginResponse>;
export const LoginResponse = ApiResponse(
  z.object({
    token: z.string(),
  })
);

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
