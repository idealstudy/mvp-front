import { notificationKeys, repository } from '@/entities/notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const ONE_MINUTE = 60 * 1000;

// 전체 알림 목록 조회
// TODO SSE 전환 예정
export const useNotifications = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: notificationKeys.list(),
    queryFn: repository.notification.getList,
    staleTime: ONE_MINUTE,
    refetchInterval: ONE_MINUTE,
    refetchOnWindowFocus: true,
    enabled: options?.enabled ?? true,
  });

// 미확인 알림 조회
export const useUnreadNotifications = () =>
  useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: repository.notification.getUnread,
    staleTime: ONE_MINUTE,
    refetchInterval: ONE_MINUTE,
    refetchOnWindowFocus: true,
  });

// 알림 읽음 처리
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationIds: number[]) =>
      repository.notification.markAsRead(notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};

// 알림 삭제
export const useDeleteNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationIds: number[]) =>
      repository.notification.delete(notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};
