import { redirect } from 'next/navigation';

import AuthBanner from '@/shared/components/auth/banner';
import { fetchMemberRole } from '@/shared/lib/server';

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await fetchMemberRole();

  if (session.status === 'authenticated') {
    if (session.role === 'ROLE_MEMBER') redirect('/select-role');
    else redirect('/dashboard');
  }

  return (
    <>
      <AuthBanner />
      {children}
    </>
  );
}
