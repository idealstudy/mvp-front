import { useSuspenseQuery } from '@tanstack/react-query';

import { sessionQueryOption } from '../services/query-options';

export const useAuthenticatedSession = () => {
  const { data: session } = useSuspenseQuery(sessionQueryOption);

  if (session === null) {
    throw new Error(
      'useAuthenticatedSession은 로그인이 필요한 페이지에서만 사용할 수 있습니다.'
    );
  }

  return { session };
};
