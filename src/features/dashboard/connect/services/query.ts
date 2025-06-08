import { useQuery } from '@tanstack/react-query';

import { ConnectionListRequestParams } from '../type';
import { connectionQueryOption } from './query-options';

export const useConnectionList = (params: ConnectionListRequestParams) => {
  return useQuery(connectionQueryOption(params));
};
