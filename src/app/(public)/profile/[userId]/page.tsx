import { redirect } from 'next/navigation';

import ProfileMain from '@/features/profile/components/profile-main';

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;

  if (!userId) redirect('/');

  return <ProfileMain userId={userId} />;
}
