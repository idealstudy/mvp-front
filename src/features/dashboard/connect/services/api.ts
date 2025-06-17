import { api } from '@/lib/api';

import { ConnectionListRequestParams, ConnectionListResponse } from '../type';

export const getConnectionList = async (
  params: ConnectionListRequestParams
) => {
  const response = await api.get<ConnectionListResponse>('/connections', {
    params,
  });
  return response;
};
