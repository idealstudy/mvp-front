import { redirect } from 'next/navigation';

import AuthBanner from '@/shared/components/auth/banner';
import { PRIVATE } from '@/shared/constants';
import { fetchMemberRole } from '@/shared/lib/server';

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await fetchMemberRole();

  if (session.status === 'authenticated') {
    if (session.role === 'ROLE_MEMBER') redirect('/select-role');
    else redirect(PRIVATE.DASHBOARD.INDEX);
  }

  return (
    <>
      <AuthBanner />
      {children}
    </>
  );
}
