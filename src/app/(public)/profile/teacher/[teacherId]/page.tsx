import Link from 'next/link';
import { notFound } from 'next/navigation';

import { repository } from '@/entities/teacher';
import ProfileMain from '@/features/profile/components/profile-main';
import { getApiError } from '@/shared/lib';

type PageProps = {
  params: Promise<{ teacherId: string }>;
};

export default async function TeacherProfilePage({ params }: PageProps) {
  const { teacherId } = await params;

  // 클라이언트 훅으로 패칭하면 비공개/미존재 케이스를 렌더링 전에 처리할 수 없으므로,
  // 서버 컴포넌트에서 직접 호출해 에러 코드에 따라 페이지 분기를 결정합니다.
  try {
    const basicInfo = await repository.profile.getProfileBasicInfo(
      Number(teacherId)
    );
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
