import {
  NotificationCategory,
  NotificationSetting,
  notificationKeys,
  repository,
} from '@/entities/notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * [GET] 알림 설정 조회
 */
export const useNotificationSettings = () => {
  return useQuery({
    queryKey: notificationKeys.settings(),
    queryFn: repository.notification.getSettings,
  });
};

/**
 * [PUT] 알림 설정 변경
 * 낙관적 업데이트 적용
 */
export const useUpdateNotificationSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      category,
      enabled,
    }: {
      category: NotificationCategory;
      enabled: boolean;
    }) => repository.notification.updateSetting(category, enabled),

    onMutate: async ({ category, enabled }) => {
      await queryClient.cancelQueries({
        queryKey: notificationKeys.settings(),
      });
      const previous = queryClient.getQueryData<NotificationSetting[]>(
        notificationKeys.settings()
      );

      queryClient.setQueryData<NotificationSetting[]>(
        notificationKeys.settings(),
        (old) =>
          old?.map((setting) =>
            setting.category === category ? { ...setting, enabled } : setting
          ) ?? []
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationKeys.settings(), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.settings() });
    },
  });
};
