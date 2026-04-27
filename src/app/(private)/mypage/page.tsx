import MyColumnList from '@/features/mypage/column/components/my-column-list';
import MyInquiryList from '@/features/mypage/inquiry/components/my-inquiry-list';
import ReceivedInquiryList from '@/features/mypage/inquiry/components/received-inquiry-list';
import ProfileMain from '@/features/mypage/profile/components/profile-main';

export default async function MypagePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;

  // TEACHER, STUDENT, PARENT
  if (tab === 'profile') return <ProfileMain />;

  // STUDENT, PARENT
  if (tab === 'inquiries') return <MyInquiryList />;

  // TEACHER_ONLY
  if (tab === 'columns') return <MyColumnList />;
  if (tab === 'received-inquiries') return <ReceivedInquiryList />;

  return null;
}
