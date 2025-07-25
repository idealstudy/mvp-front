import { queryKey } from '@/constants/query-key';
import { useQueryClient } from '@tanstack/react-query';

import { parseSession } from '../services/session';
import {
  removeSessionToken,
  saveSessionToken,
} from '../services/session-token';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const login = (token: string) => {
    const session = parseSession(token);
    queryClient.setQueryData(queryKey.session, session);
    saveSessionToken(token);
  };

  const logout = () => {
    queryClient.removeQueries({
      queryKey: queryKey.session,
      exact: true,
    });

    removeSessionToken();
  };

  return {
    login,
    logout,
  };
};
