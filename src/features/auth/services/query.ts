import { useRouter } from 'next/navigation';

import { LoginResponse } from '@/features/auth/type';
import { deleteJwtCookies, setJwtCookies } from '@/lib/cookie';
import { decodeToken } from '@/lib/utils';
import { LoginFormValues } from '@/schema/login';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authApi, login } from './api';
import { sessionQueryKey, sessionQueryOption } from './query-options';

export const useSessionQuery = () => {
  return useQuery(sessionQueryOption);
};

export const useLoginMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginFormValues) => {
      return await login(data);
    },
    onSuccess: async (data: LoginResponse) => {
      await setJwtCookies(data.token);
      queryClient.setQueryData(sessionQueryKey, decodeToken(data.token));
      router.replace('/dashboard');
    },
  });
};

export const useLogoutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await authApi.logout();
    },
    onSuccess: async () => {
      await deleteJwtCookies();
      queryClient.setQueryData(sessionQueryKey, null);
      router.replace('/');
    },
  });
};

export const useCheckEmailDuplicate = () => {
  return useMutation({
    mutationFn: authApi.checkEmailDuplicate,
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: authApi.signUp,
  });
};

export const useVerifyCode = () => {
  return useMutation({
    mutationFn: authApi.verifyCode,
  });
};
