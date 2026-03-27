import type {
  ConnectListPageDTO,
  ConnectListPayload,
} from '@/entities/connect/types';
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';
import { CommonResponse } from '@/types';

import { dto, payload } from './connect.dto';

const baseUrl = {
  base: '/connections',
  requests: '/connections/requests',
};

// 연결된 사용자 목록을 조회한다.
const getConnectionList = async (
  query: ConnectListPayload
): Promise<ConnectListPageDTO> => {
  const params = payload.listQuery.parse(query);

  const response = await api.private.get<CommonResponse<ConnectListPageDTO>>(
    baseUrl.base,
    { params }
  );
  return unwrapEnvelope(response, dto.listPage);
};

// 보낸 연결 요청 목록을 조회한다.
const getSentConnectionList = async (
  query: ConnectListPayload
): Promise<ConnectListPageDTO> => {
  const params = payload.listQuery.parse(query);

  const response = await api.private.get<CommonResponse<ConnectListPageDTO>>(
    `${baseUrl.requests}/sent`,
    { params }
  );
  return unwrapEnvelope(response, dto.listPage);
};

// 받은 연결 요청 목록을 조회한다.
const getReceivedConnectionList = async (
  query: ConnectListPayload
): Promise<ConnectListPageDTO> => {
  const params = payload.listQuery.parse(query);

  const response = await api.private.get<CommonResponse<ConnectListPageDTO>>(
    `${baseUrl.requests}/received`,
    { params }
  );
  return unwrapEnvelope(response, dto.listPage);
};

// 연결을 요청한다.
const createConnection = async (recipientEmail: string) => {
  await api.private.post(baseUrl.base, { recipientEmail });
};

// 연결 요청을 거절한다.
const rejectConnection = async (connectionId: number) => {
  await api.private.patch(`${baseUrl.base}/${connectionId}/reject`);
};

// 연결 요청을 수락한다.
const acceptConnection = async (connectionId: number) => {
  await api.private.patch(`${baseUrl.base}/${connectionId}/accept`);
};

// 연결을 삭제한다.
const deleteConnection = async (connectionId: number) => {
  await api.private.delete(`${baseUrl.base}/${connectionId}`);
};

export const repository = {
  connect: {
    createConnection,
    rejectConnection,
    acceptConnection,
    deleteConnection,
    getConnectionList,
    getSentConnectionList,
    getReceivedConnectionList,
  },
};
