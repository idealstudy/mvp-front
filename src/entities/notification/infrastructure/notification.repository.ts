import { domain } from '@/entities/notification/core';
import {
  NotificationCategory,
  NotificationItem,
} from '@/entities/notification/types';
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';

import { dto } from './notification.dto';

/* ─────────────────────────────────────────────────────
 * [Read] 알림 목록 조회
 * ────────────────────────────────────────────────────*/
const getNotificationList = async (): Promise<NotificationItem[]> => {
  const response = await api.private.get('/notification/all');
  const dtos = unwrapEnvelope(response, dto.arraySchema);
  return dtos.map((dto) => domain.schema.parse(dto));
};

/* ─────────────────────────────────────────────────────
 * [Read] 미확인 알림 조회
 * ────────────────────────────────────────────────────*/
const getUnreadNotifications = async () => {
  const response = await api.private.get('/notification/unread');
  const dtos = unwrapEnvelope(response, dto.arraySchema);
  return dtos.map((dto) => domain.schema.parse(dto));
};

/* ─────────────────────────────────────────────────────
 * [Update] 알림 읽음 처리
 * ────────────────────────────────────────────────────*/
const markAsRead = async (notificationIds: number[]): Promise<void> => {
  await api.private.patch('/notification/read', { notificationIds });
};

/* ─────────────────────────────────────────────────────
 * [Delete] 알림 삭제
 * ────────────────────────────────────────────────────*/
const deleteNotifications = async (
  notificationIds: number[]
): Promise<void> => {
  await api.private.delete('/notification', {
    data: { notificationIds },
  });
};

/* ─────────────────────────────────────────────────────
 * [Read] 알림 수신 설정 조회
 * ────────────────────────────────────────────────────*/
const getNotificationSettings = async () => {
  const response = await api.private.get('/members/notification-settings');
  return unwrapEnvelope(response, dto.settingArray);
};

/* ─────────────────────────────────────────────────────
 * [Update] 알림 수신 설정 변경
 * ────────────────────────────────────────────────────*/
const updateNotificationSetting = async (
  category: NotificationCategory,
  enabled: boolean
): Promise<void> => {
  await api.private.put(`/members/notification-settings/${category}`, {
    enabled,
  });
};

/* ─────────────────────────────────────────────────────
 * [Read] 마케팅 수신 동의 여부 조회
 * ────────────────────────────────────────────────────*/
const getMarketingConsent = async () => {
  const response = await api.private.get('/members/marketing-consent');
  return unwrapEnvelope(response, dto.marketingConsent);
};

/* ─────────────────────────────────────────────────────
 * [Update] 마케팅 수신 동의 여부 변경
 * ────────────────────────────────────────────────────*/
const toggleMarketingConsent = async () => {
  const response = await api.private.patch('/members/marketing-consent/toggle');
  return unwrapEnvelope(response, dto.marketingConsent);
};

export const repository = {
  notification: {
    getList: getNotificationList,
    getUnread: getUnreadNotifications,
    markAsRead: markAsRead,
    delete: deleteNotifications,
    getSettings: getNotificationSettings,
    updateSetting: updateNotificationSetting,
    getMarketingConsent,
    toggleMarketingConsent,
  },
};
