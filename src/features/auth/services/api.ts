import {
  CheckEmailDuplicateBody,
  LoginBody,
  LoginResponse,
  SignUpBody,
  VerifyCodeBody,
} from '@/features/auth/type';
import { api } from '@/lib/api';

export const authApi = {
  login: async (body: LoginBody) => {
    const response = await api.post('/auth/login', body);
    return LoginResponse.parse(response);
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
