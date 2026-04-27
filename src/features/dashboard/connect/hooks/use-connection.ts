import {
  ConnectListPayload,
  ConnectSearchPayload,
  connectionKeys,
  repository,
} from '@/entities/connect';
import { parentKeys } from '@/entities/parent';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

// 연결된 사용자 목록 조회
export const useConnectionList = (query: ConnectListPayload) =>
  useQuery({
    queryKey: connectionKeys.list(query),
    queryFn: () => repository.connect.getConnectionList(query),
  });

// 보낸 연결 요청 조회
export const useSentConnectionList = (query: ConnectListPayload) =>
  useQuery({
    queryKey: connectionKeys.sentList(query),
    queryFn: () => repository.connect.getSentConnectionList(query),
  });

// 받은 연결 요청 조회
export const useReceivedConnectionList = (query: ConnectListPayload) =>
  useQuery({
    queryKey: connectionKeys.receivedList(query),
    queryFn: () => repository.connect.getReceivedConnectionList(query),
  });

// 연결 요청 가능한 사용자 검색
export const useSearchConnectionMembers = (
  query: ConnectSearchPayload,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: connectionKeys.search(query),
    queryFn: () => repository.connect.searchConnectionMembers(query),
    enabled: options?.enabled ?? query.keyword.trim().length > 0,
    retry: false,
  });

// 공통 mutation onSuccess
const invalidateConnectionQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: connectionKeys.lists() });
  queryClient.invalidateQueries({ queryKey: connectionKeys.sentLists() });
  queryClient.invalidateQueries({ queryKey: connectionKeys.receivedLists() });
  queryClient.invalidateQueries({ queryKey: connectionKeys.searches() });

  queryClient.invalidateQueries({
    queryKey: parentKeys.dashboard.connectedStudentList(),
  });

  queryClient.invalidateQueries({
    queryKey: parentKeys.dashboard.report(),
  });
};

// 연결 요청
export const useCreateConnection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipientEmail: string) =>
      repository.connect.createConnection(recipientEmail),
    onSuccess: () => {
      invalidateConnectionQueries(queryClient);
    },
  });
};

// 연결 요청 거절
export const useRejectConnection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (connectionId: number) =>
      repository.connect.rejectConnection(connectionId),
    onSuccess: () => {
      invalidateConnectionQueries(queryClient);
    },
  });
};

// 연결 요청 수락
export const useAcceptConnection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (connectionId: number) =>
      repository.connect.acceptConnection(connectionId),
    onSuccess: () => {
      invalidateConnectionQueries(queryClient);
    },
  });
};

// 연결 삭제
export const useDeleteConnection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (connectionId: number) =>
      repository.connect.deleteConnection(connectionId),
    onSuccess: () => {
      invalidateConnectionQueries(queryClient);
    },
  });
};
