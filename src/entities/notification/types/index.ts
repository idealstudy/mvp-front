import { domain } from '@/entities/notification/core';
import { dto } from '@/entities/notification/infrastructure';
import { z } from 'zod';

export type NotificationCategory = z.infer<typeof dto.category>;
export type NotificationItem = z.infer<typeof domain.schema>;
export type NotificationSetting = z.infer<typeof dto.setting>;
