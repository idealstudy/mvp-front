import PageViewTracker from '@/app/(private)/study-rooms/[id]/note/[noteId]/page-view-tracker';
import LoginForm from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-[570px] px-4">
      <PageViewTracker pageName="auth_login" />
      <LoginForm />
    </main>
  );
}
