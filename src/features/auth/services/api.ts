import {
  CheckEmailDuplicateBody,
  LoginBody,
  LoginResponse,
  SignUpBody,
  VerifyCodeBody,
} from '@/features/auth/type';
import { api } from '@/lib/api';
import { LoginFormValues } from '@/schema/login';

export const login = async (params: LoginFormValues) => {
  const response = await api.post<LoginResponse>('/auth/login', params);
  return response;
};

export const logout = async () => {
  const response = await api.post<LoginResponse>('/auth/logout');
  return response;
};

export const authApi = {
  login: async (body: LoginBody) => {
    return api.post<LoginResponse>('/auth/login', body);
  },
  logout: async () => {
    return api.post('/auth/logout');
  },
  checkEmailDuplicate: async (body: CheckEmailDuplicateBody) => {
    return api.post('/public/email-verifications/check-duplicate', body);
  },
  verifyCode: async (body: VerifyCodeBody) => {
    return api.patch('/public/email-verifications', body);
  },
  signUp: async (body: SignUpBody) => {
    return api.post('/auth/sign-up', body);
  },
};
