'use client';

import { UserBasicInfo } from '@/features/mypage/types';
import ProfileLayout from '@/features/profile/components/profile-layout';
import { useProfile } from '@/features/profile/hooks/use-profile';

export default function ProfileMain({ userId }: { userId: string }) {
  // TODO 새 API 연결
  const { data: profileData, isLoading } = useProfile(userId);

  const MOCK_PROFILE_DATA: UserBasicInfo = {
    name: profileData?.name || '',
    email: profileData?.email || '',
    isProfilePublic: true,
    simpleIntroduction: '',
    role: 'ROLE_TEACHER',
    profilePublicKorean: '공개',
  };

  if (isLoading) {
    return <div className="text-center">로딩중...</div>;
  }

  if (!profileData) {
    return <div className="text-center">프로필 정보를 불러올 수 없습니다.</div>;
  }

  return <ProfileLayout basicInfo={MOCK_PROFILE_DATA} />;
}
