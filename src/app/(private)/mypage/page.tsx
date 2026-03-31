import MyColumnList from '@/features/mypage/column/components/my-column-list';
import MyConsultationList from '@/features/mypage/consultation/components/my-consultation-list';
import ProfileMain from '@/features/mypage/profile/components/profile-main';

export default async function MypagePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;

  if (tab === 'columns') return <MyColumnList />;
  if (tab === 'profile') return <ProfileMain />;
  if (tab === 'consultations') return <MyConsultationList />;

  return null;
}
