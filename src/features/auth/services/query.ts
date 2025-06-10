import { useRouter } from 'next/navigation';

import { removeLocalStorage, setLocalStorage } from '@/lib/localStorage';
import { decodeToken } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authApi } from './api';
import { sessionQueryKey, sessionQueryOption } from './query-options';

export const useSessionQuery = () => {
  return useQuery(sessionQueryOption);
};

export const useLoginMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (result) => {
      setLocalStorage('accessToken', result.token);
      queryClient.setQueryData(sessionQueryKey, decodeToken(result.token));
      router.replace('/dashboard');
    },
  });
};

export const useLogoutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      removeLocalStorage('accessToken');
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
