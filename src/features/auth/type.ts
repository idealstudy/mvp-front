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
export interface LoginResponse {
  token: string;
}

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
