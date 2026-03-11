import { redirect } from 'next/navigation';

import ProfileMain from '@/features/profile/components/profile-main';

type PageProps = {
  params: Promise<{ studentId: string }>;
};

export default async function StudentProfilePage({ params }: PageProps) {
  const { studentId } = await params;

  if (!studentId) redirect('/');

  return (
    <ProfileMain
      memberId={Number(studentId)}
      role="ROLE_STUDENT"
    />
  );
}
