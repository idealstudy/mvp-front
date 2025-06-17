import { useQuery } from '@tanstack/react-query';

import { sessionQueryOption } from '../services/query-options';

export const useSession = () => {
  return useQuery(sessionQueryOption);
};
