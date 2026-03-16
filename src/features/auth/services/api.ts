import { MemberDTO } from '@/entities/member';
import { factory } from '@/entities/member/core';
import { adapters } from '@/entities/member/infrastructure/member.adapters';
import {
  CheckEmailDuplicateBody,
  CheckPhoneNumberDuplicateQuery,
  LoginBody,
  SignUpBody,
  UpdateProfileBody,
  VerifyCodeBody,
} from '@/features/auth/types';
import { api } from '@/shared/api';
import { CommonResponse } from '@/types';

export const authService = {
  login: async (body: LoginBody) => {
    await api.bff.client.post('/api/v1/auth/login', body, {
      withCredentials: true,
    });
  },
  logout: async () => {
    return api.bff.client.post('/api/v1/auth/logout', undefined, {
      withCredentials: true,
    });
  },
  getSession: async () => {
    try {
      const response = await api.bff.client.get<CommonResponse<MemberDTO>>(
        '/api/v1/member/info'
      );
      const validatedResponse = adapters.fromApi.parse(response);

      const memberData = validatedResponse.data;

      if (memberData.role === 'ROLE_MEMBER') {
        window.location.href = '/select-role';
        return null;
      }

      return factory.member.create(validatedResponse.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      // console.error('Session Data Parsing Error:', e);
      return null;
    }
  },
  checkEmailDuplicate: async (body: CheckEmailDuplicateBody) => {
    return api.public.post('/public/email-verifications/check-duplicate', body);
  },
  verifyCode: async (body: VerifyCodeBody) => {
    return api.public.post('/public/email-verifications/verify-code', body);
  },
  signUp: async (body: SignUpBody) => {
    return api.public.post('/auth/sign-up', body);
  },
  updateProfile: async (body: UpdateProfileBody) => {
    return api.private.put('/member/members/profile', body);
  },
  checkPhoneNumberDuplicate: async (params: CheckPhoneNumberDuplicateQuery) => {
    return api.public.get('/public/members', { params });
  },
};
