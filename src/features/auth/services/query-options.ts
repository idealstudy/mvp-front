import { decodedJWTStorage } from '@/lib/localStorage';
import { queryOptions } from '@tanstack/react-query';

export const sessionQueryKey = ['session-info'];
export const sessionQueryOption = queryOptions({
  queryKey: sessionQueryKey,
  queryFn: decodedJWTStorage,
  retry: false,
});
