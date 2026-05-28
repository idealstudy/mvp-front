import { cache } from 'react';

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SITE_CONFIG } from '@/config/site';
import { repository } from '@/entities/student';
import ProfileMain from '@/features/profile/components/profile-main';
import { getApiError } from '@/shared/lib';

type PageProps = {
  params: Promise<{ studentId: string }>;
};

const getBasicInfo = cache((studentId: number) =>
  repository.profile.getProfileBasicInfo(studentId)
);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { studentId } = await params;

  try {
    const basicInfo = await getBasicInfo(Number(studentId));

    return {
      title: `${basicInfo.name} | 학생 프로필`,
      description: basicInfo.learningGoal ?? undefined,
      robots: { index: false, follow: false }, // 학생 SEO 노출 제외
    };
  } catch {
    return { title: SITE_CONFIG.name };
  }
}

export default async function StudentProfilePage({ params }: PageProps) {
  const { studentId } = await params;

  const id = Number(studentId);
  if (isNaN(id)) notFound();

  try {
    const basicInfo = await getBasicInfo(id);
    return (
      <ProfileMain
        basicInfo={basicInfo}
        memberId={id}
        role="ROLE_STUDENT"
      />
    );
  } catch (error) {
    const code = getApiError(error)?.code;
    if (code === 'MEMBER_NOT_EXIST') notFound();
    if (code === 'PROFILE_NOT_PUBLIC')
      return (
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
