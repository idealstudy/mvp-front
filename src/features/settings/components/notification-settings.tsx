'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Toggle } from '@/shared/components/ui/toggle';
import { link } from '@/shared/constants';

type ServiceSubKey = 'note' | 'qna' | 'homework' | 'inquiry';

const SERVICE_SUB_ITEMS: Record<
  ServiceSubKey,
  { label: string; description: string }
> = {
  note: {
    label: '수업노트',
    description: '수업노트 등록 및 관련 활동 알림',
  },
  qna: { label: '질문/답변', description: '질문 등록 및 답변 알림' },
  homework: { label: '과제', description: '과제 등록 및 제출 알림' },
  inquiry: {
    label: '수업상담',
    description: '수업 상담 등록 및 답변 알림',
  },
};

const SERVICE_SUB_KEYS: ServiceSubKey[] = [
  'note',
  'qna',
  'homework',
  'inquiry',
];

type NotificationState = {
  service: boolean;
  serviceSub: Record<ServiceSubKey, boolean>;
  event: boolean;
};

const initialState: NotificationState = {
  service: true,
  serviceSub: { note: true, qna: true, homework: true, inquiry: true },
  event: true,
};

export default function NotificationSettings() {
  const [state, setState] = useState<NotificationState>(initialState);

  const handleService = (checked: boolean) => {
    setState((prev) => ({ ...prev, service: checked }));
  };

  const handleServiceSub = (key: ServiceSubKey, checked: boolean) => {
    setState((prev) => ({
      ...prev,
      serviceSub: { ...prev.serviceSub, [key]: checked },
    }));
  };

  const handleEvent = (checked: boolean) => {
    setState((prev) => ({ ...prev, event: checked }));
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-body1-heading">알림</h2>

      {/* 서비스 안내 알림 */}
      <div className="border-line-line1 rounded-xl border bg-white p-6">
        <div className="flex items-center gap-2">
          <Toggle
            checked={state.service}
            onCheckedChange={handleService}
          />
          <span className="font-body1-heading">서비스 안내 알림</span>
        </div>
        <p className="text-text-sub2 font-caption-normal mt-2">
          선택한 알림은 서비스 내 알림과 카카오 알림으로 함께 발송돼요.
          <br />내 활동과 관련된 중요한 소식을 받아볼 수 있어요.
        </p>

        <div className="border-gray-4 mt-4 flex flex-col gap-4 border-t pt-4 pl-4">
          {SERVICE_SUB_KEYS.map((key) => (
            <div
              key={key}
              className="flex items-center gap-2"
            >
              <Toggle
                checked={state.service && state.serviceSub[key]}
                onCheckedChange={(checked) => handleServiceSub(key, checked)}
                disabled={!state.service}
              />
              <span className="">{SERVICE_SUB_ITEMS[key].label}</span>
              <span className="font-caption-normal text-text-sub2">
                ⓘ {SERVICE_SUB_ITEMS[key].description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 이벤트 혜택 알림 */}
      <div className="border-line-line1 rounded-xl border bg-white p-6">
        <div className="mb-2 flex items-center gap-2">
          <Toggle
            checked={state.event}
            onCheckedChange={handleEvent}
          />
          <span className="font-body1-heading">이벤트 혜택 알림</span>
          {/* TODO API 연결 시 동적 값으로 교체 필요 */}
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
      </div>
    </div>
  );
}
