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

/**
 * [GET] 마케팅 수신 동의 여부 조회
 */
export const useMarketingConsent = () => {
  return useQuery({
    queryKey: notificationKeys.marketingConsent(),
    queryFn: repository.notification.getMarketingConsent,
  });
};

/**
 * [PATCH] 마케팅 수신 동의 여부 변경
 * 낙관적 업데이트 적용
 */
export const useToggleMarketingConsent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: repository.notification.toggleMarketingConsent,

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: notificationKeys.marketingConsent(),
      });
      const previous = queryClient.getQueryData<boolean>(
        notificationKeys.marketingConsent()
      );
      queryClient.setQueryData<boolean>(
        notificationKeys.marketingConsent(),
        (old) => !old
      );
      return { previous };
    },

    onSuccess: (newValue) => {
      queryClient.setQueryData(notificationKeys.marketingConsent(), newValue);
    },

    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(
          notificationKeys.marketingConsent(),
          context.previous
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.marketingConsent(),
      });
    },
  });
};
