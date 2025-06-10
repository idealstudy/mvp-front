import { queryOptions } from '@tanstack/react-query';

import { ConnectionListRequestParams } from '../type';
import { getConnectionList } from './api';

export const connectionQueryKey = {
  all: ['connection'],
  lists: () => [...connectionQueryKey.all, 'list'],
  list: (params: ConnectionListRequestParams) => [
    ...connectionQueryKey.lists(),
    params,
  ],
};
export const connectionQueryOption = (params: ConnectionListRequestParams) =>
  queryOptions({
    queryKey: connectionQueryKey.list(params),
    queryFn: () => getConnectionList(params),
    retry: false,
  });
