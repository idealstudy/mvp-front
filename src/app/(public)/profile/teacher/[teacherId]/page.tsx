import { cache } from 'react';

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SITE_CONFIG } from '@/config/site';
import { repository } from '@/entities/teacher';
import ProfileMain from '@/features/profile/components/profile-main';
import { generateTeacherProfileMetadata } from '@/features/profile/metadata';
import { getApiError } from '@/shared/lib';

type PageProps = {
  params: Promise<{ teacherId: string }>;
};

// 같은 요청 내에서 중복 호출 방지
const getBasicInfo = cache((teacherId: number) =>
  repository.profile.getProfileBasicInfo(teacherId)
);

// 메타데이터
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { teacherId } = await params;

  try {
    const basicInfo = await getBasicInfo(Number(teacherId));
    return generateTeacherProfileMetadata(teacherId, basicInfo);
  } catch (error) {
    // 비공개 프로필일 경우, 색인 방지
    if (getApiError(error)?.code === 'PROFILE_NOT_PUBLIC') {
      return { robots: { index: false, follow: false } };
    }

    return { title: SITE_CONFIG.name };
  }
}

export default async function TeacherProfilePage({ params }: PageProps) {
  const { teacherId } = await params;

  // 클라이언트 훅으로 패칭하면 비공개/미존재 케이스를 렌더링 전에 처리할 수 없으므로,
  // 서버 컴포넌트에서 직접 호출해 에러 코드에 따라 페이지 분기를 결정합니다.
  try {
    const basicInfo = await getBasicInfo(Number(teacherId));
    return (
      <ProfileMain
        basicInfo={basicInfo}
        memberId={Number(teacherId)}
        role="ROLE_TEACHER"
      />
    );
  } catch (error) {
    const code = getApiError(error)?.code;
    // 멤버가 존재하지 않는 경우
    if (code === 'MEMBER_NOT_EXIST') notFound();
    // 비공개 프로필인 경우
    if (code === 'PROFILE_NOT_PUBLIC')
      return (
        // TODO 임시 처리입니다. (디자인 필요)
        <div className="flex h-dvh flex-1 flex-col items-center justify-center gap-4">
          <p className="font-body1-heading">비공개 프로필입니다.</p>
          <Link
            href="/"
            className="text-key-color-primary font-body2-normal underline"
          >
            홈으로 돌아가기
          </Link>
        </div>
      );
    throw error;
  }
}
