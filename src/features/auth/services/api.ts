import { LoginResponse } from '@/features/auth/type';
import { api } from '@/lib/api';
import { LoginFormValues } from '@/schema/login';

export const login = async (params: LoginFormValues) => {
  const response = await api.post<LoginResponse>(
    'http://13.125.112.205:8080/api/auth/login',
    params
  );
  return response;
};

export const logout = async () => {
  const response = await api.post<LoginResponse>(
    'http://13.125.112.205:8080/api/auth/logout'
  );
  return response;
};

export const testError = async () => {
  const response = await api.post<LoginResponse>(
    'http://13.125.112.205:8080/api/users/asdfjkasfdlkafsdjl'
  );
  return response;
};

export type UserRole = (typeof USER_ROLES)[number];
export const USER_ROLES = [
  'ROLE_STUDENT',
  'ROLE_TEACHER',
  'ROLE_PARENT',
] as const;

export const authApi = {
  sendVerificationCode: async (body: SendVerificationCodeBody) => {
    return body;
    // return api.post('/public/email-verifications', body);
  },
  verifyCode: async (body: VerifyCodeBody) => {
    // throw new Error('Verification code is invalid');

    return body;
    // return api.patch('/public/email-verifications', body);
  },
  signUp: async (body: SignUpBody) => {
    return api.post('/auth/sign-up', body);
  },
};

type SendVerificationCodeBody = {
  email: string;
};

type VerifyCodeBody = {
  email: string;
  code: string;
};

type SignUpBody = {
  email: string;
  verificationCode: string;
  password: string;
  name: string;
  acceptOptionalTerm: boolean;
  role: UserRole;
  invitationCode: string;
};
