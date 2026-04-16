'use client';

import { NotificationCategory } from '@/entities/notification';
import {
  useNotificationSettings,
  useUpdateNotificationSetting,
} from '@/features/settings/hooks/use-notification';
import { Toggle } from '@/shared/components/ui/toggle';

type ServiceSubCategory = Extract<
  NotificationCategory,
  'TEACHING_NOTE' | 'QNA' | 'HOMEWORK' | 'INQUIRY'
>;

const SERVICE_SUB_ITEMS: Record<
  ServiceSubCategory,
  { label: string; description: string }
> = {
  TEACHING_NOTE: {
    label: '수업노트',
    description: '수업노트 등록 및 관련 활동 알림',
  },
  QNA: { label: '질문/답변', description: '질문 등록 및 답변 알림' },
  HOMEWORK: { label: '과제', description: '과제 등록 및 제출 알림' },
  INQUIRY: {
    label: '수업상담',
    description: '수업 상담 등록 및 답변 알림',
  },
};

const SERVICE_SUB_KEYS = Object.keys(SERVICE_SUB_ITEMS) as ServiceSubCategory[];

export default function NotificationSettings() {
  // const [event, setEvent] = useState(true);
  const { data: notificationSettings } = useNotificationSettings();
  const updateNotificationSettingMutation = useUpdateNotificationSetting();

  const settingsMap = new Map(
    notificationSettings?.map((setting) => [setting.category, setting.enabled])
  );

  const getEnabled = (category: NotificationCategory) =>
    settingsMap.get(category) ?? false;

  const serviceEnabled = getEnabled('ALL');

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-body1-heading">알림</h2>

      {/* 서비스 안내 알림 */}
      <div className="border-line-line1 rounded-xl border bg-white p-6">
        <div className="flex items-center gap-2">
          <Toggle
            checked={serviceEnabled}
            onCheckedChange={(checked) =>
              updateNotificationSettingMutation.mutate({
                category: 'ALL',
                enabled: checked,
              })
            }
          />
          <span className="font-body1-heading">서비스 안내 알림</span>
        </div>
        <p className="text-text-sub2 font-caption-normal mt-2">
          선택한 알림은 서비스 내 알림과 카카오 알림으로 함께 발송돼요.
          <br />내 활동과 관련된 중요한 소식을 받아볼 수 있어요.
        </p>

        <div className="border-gray-4 mt-4 flex flex-col gap-4 border-t pt-4 pl-4">
          {SERVICE_SUB_KEYS.map((category) => (
            <div
              key={category}
              className="flex items-center gap-2"
            >
              <Toggle
                checked={serviceEnabled && getEnabled(category)}
                onCheckedChange={(checked) =>
                  updateNotificationSettingMutation.mutate({
                    category,
                    enabled: checked,
                  })
                }
                disabled={!serviceEnabled}
              />
              <span>{SERVICE_SUB_ITEMS[category].label}</span>
              <span className="font-caption-normal text-text-sub2">
                ⓘ {SERVICE_SUB_ITEMS[category].description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TODO API 연결 */}
      {/* 이벤트 혜택 알림 */}
      {/* <div className="border-line-line1 rounded-xl border bg-white p-6">
        <div className="mb-2 flex items-center gap-2">
          <Toggle
            checked={event}
            onCheckedChange={setEvent}
          />
          <span className="font-body1-heading">이벤트 혜택 알림</span>
          <span className="font-caption-normal text-text-sub2">
            수신 동의 일자 : 2026.04.12 14:12
          </span>
        </div>
        <p>
          <span aria-hidden>&gt;</span>
          <Link
            href={link.marketing}
            target="_blank"
            title="혜택 및 이벤트 정보 수신 동의 전문 보기"
            className="font-caption-normal mt-2 ml-1 hover:underline"
          >
            혜택 및 이벤트 정보 수신 동의 전문 보기
          </Link>
        </p>
      </div> */}
    </div>
  );
}
