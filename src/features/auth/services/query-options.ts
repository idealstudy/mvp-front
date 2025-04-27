import { decodedJWTCookie } from '@/lib/cookie';
import { queryOptions } from '@tanstack/react-query';

export const sessionQueryKey = ['session-info'];
export const sessionQueryOption = queryOptions({
  queryKey: sessionQueryKey,
  queryFn: decodedJWTCookie,
  retry: false,
});
