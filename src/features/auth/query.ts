import { LoginFormValues } from '@/schema/login';
import { useMutation } from '@tanstack/react-query';

import { login } from './api';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: LoginFormValues) => {
      return await login(data);
    },
  });
};
