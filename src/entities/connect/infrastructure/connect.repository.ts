import type {
  ConnectListItemDTO,
  ConnectListPageDTO,
  ConnectListPayload,
  ConnectSearchMemberDTO,
  ConnectSearchPayload,
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

// 연결 요청할 사용자를 검색한다.
const searchConnectionMembers = async (
  query: ConnectSearchPayload
): Promise<ConnectSearchMemberDTO[]> => {
  const params = payload.searchQuery.parse(query);

  const response = await api.private.get<
    CommonResponse<ConnectSearchMemberDTO[]>
  >(`${baseUrl.base}/search`, { params });
  return unwrapEnvelope(response, dto.searchMembers);
};

// 연결을 요청한다.
const createConnection = async (
  recipientEmail: string
): Promise<ConnectListItemDTO> => {
  const response = await api.private.post<CommonResponse<ConnectListItemDTO>>(
    baseUrl.base,
    undefined,
    { params: { recipientEmail } }
  );
  return unwrapEnvelope(response, dto.listItem);
};

// 연결 요청을 거절한다.
const rejectConnection = async (
  connectionId: number
): Promise<ConnectListItemDTO> => {
  const response = await api.private.patch<CommonResponse<ConnectListItemDTO>>(
    `${baseUrl.base}/${connectionId}/reject`
  );
  return unwrapEnvelope(response, dto.listItem);
};

// 연결 요청을 수락한다.
const acceptConnection = async (
  connectionId: number
): Promise<ConnectListItemDTO> => {
  const response = await api.private.patch<CommonResponse<ConnectListItemDTO>>(
    `${baseUrl.base}/${connectionId}/accept`
  );
  return unwrapEnvelope(response, dto.listItem);
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
    searchConnectionMembers,
  },
};
