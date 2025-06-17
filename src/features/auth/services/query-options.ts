import { queryKey } from '@/constants/query-key';
import { queryOptions } from '@tanstack/react-query';

import { getSession } from './session';

export const sessionQueryOption = queryOptions({
  queryKey: queryKey.session,
  queryFn: getSession,
  retry: false,
});
