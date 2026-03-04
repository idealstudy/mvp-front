import { redirect } from 'next/navigation';

import { fetchMemberRole } from '@/shared/lib/server';

const ASSIGNED_ROLES = new Set(['ROLE_STUDENT', 'ROLE_TEACHER', 'ROLE_PARENT']);

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await fetchMemberRole();

  // 비로그인 또는 만료된 세션 → 로그인 페이지
  // if (session.status !== 'authenticated') redirect('/login');

  // 역할이 이미 있는 사용자(학생·선생님·학부모) → 대시보드
  if (session.status === 'authenticated' && ASSIGNED_ROLES.has(session.role))
    redirect('/dashboard');

  return <>{children}</>;
}
