import { RegisterFunnel } from '@/features/auth/components/register-funnel';
import { PageViewTracker } from '@/shared/components/analytics';

export default function RegisterPage() {
  return (
    <main className="mx-auto w-full max-w-[570px] px-4 pb-[180px]">
      <PageViewTracker pageName="auth_signup" />
      <RegisterFunnel />
    </main>
  );
}
