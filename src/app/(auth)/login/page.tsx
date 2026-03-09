import LoginForm from '@/features/auth/components/login-form';
import { PageViewTracker } from '@/shared/components/gtm';

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-[570px] px-4">
      <PageViewTracker pageName="auth_login" />
      <LoginForm />
    </main>
  );
}
