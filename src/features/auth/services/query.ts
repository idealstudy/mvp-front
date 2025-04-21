import { useRouter } from 'next/navigation';

import { LoginResponse } from '@/features/auth/type';
import { deleteJwtCookies, setJwtCookies } from '@/lib/cookie';
import { decodeToken } from '@/lib/utils';
import { LoginFormValues } from '@/schema/login';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { login, logout } from './api';
import { sessionQueryKey, sessionQueryOption } from './query-options';

export const useSessionQuery = () => {
  return useQuery(sessionQueryOption);
};

export const useLoginMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await login(data);
      return response;
    },
    onSuccess: async (data: LoginResponse) => {
      await setJwtCookies(data.token);
      queryClient.setQueryData(sessionQueryKey, decodeToken(data.token));
      router.replace('/');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const useLogoutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await logout();
      return response;
    },
    onSuccess: async () => {
      await deleteJwtCookies();
      queryClient.setQueryData(sessionQueryKey, null);
      router.replace('/');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });
};
