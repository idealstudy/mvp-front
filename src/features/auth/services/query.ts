import { useRouter } from 'next/navigation';

import { ROUTE } from '@/constants/route';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useAuth } from '../hooks/use-auth';
import { authApi } from './api';
import { sessionQueryOption } from './query-options';

export const useSession = () => {
  return useQuery(sessionQueryOption);
};

export const useLoginMutation = () => {
  const router = useRouter();
  const auth = useAuth();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      auth.login(data.token);
      router.replace(ROUTE.DASHBOARD.HOME);
    },
  });
};

export const useLogoutMutation = () => {
  const router = useRouter();

  const auth = useAuth();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      auth.logout();
      router.replace(ROUTE.HOME);
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
