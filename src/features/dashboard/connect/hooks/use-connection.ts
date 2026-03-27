import {
  ConnectListPayload,
  connectionKeys,
  repository,
} from '@/entities/connect';
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

// 공통 mutation onSuccess
const invalidateConnectionQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: connectionKeys.lists() });
  queryClient.invalidateQueries({ queryKey: connectionKeys.sentLists() });
  queryClient.invalidateQueries({ queryKey: connectionKeys.receivedLists() });
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
