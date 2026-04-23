import AccountSettings from '@/features/settings/components/account-settings';
import NotificationSettings from '@/features/settings/components/notification-settings';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-300 space-y-10 p-6">
      <h1 className="font-title-heading mt-4 text-2xl lg:text-3xl">환경설정</h1>
      {/* 알림 설정 */}
      <NotificationSettings />
      {/* 계정 설정 - 탈퇴 */}
      <AccountSettings />
    </div>
  );
}
