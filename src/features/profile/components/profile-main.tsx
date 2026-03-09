'use client';

import ProfileCard from '@/features/profile/components/profile-card/profile-card';
import TeacherSections from '@/features/profile/components/teacher-sections';
import { useProfileBasicInfo } from '@/features/profile/hooks/use-profile-basic-info';
import { useProfileReport } from '@/features/profile/hooks/use-profile-report';
import { ColumnLayout } from '@/layout';

export default function ProfileMain({ memberId }: { memberId: number }) {
  // 임시 처리
  const role = 'ROLE_TEACHER';

  const teacherBasicInfoQuery = useProfileBasicInfo(memberId, {
    enabled: role === 'ROLE_TEACHER',
  });
  // TODO 학생 api 추가

  const basicInfoQuery =
    role === 'ROLE_TEACHER' ? teacherBasicInfoQuery : teacherBasicInfoQuery;

  const teacherReportQuery = useProfileReport(memberId, {
    enabled: role === 'ROLE_TEACHER',
  });

  let sections;

  switch (role) {
    case 'ROLE_TEACHER':
      sections = <TeacherSections teacherId={memberId} />;
      break;
    // case 'ROLE_STUDENT':
    //   sections = <StudentSections />;
    //   break;
    // case 'ROLE_PARENT':
    //   sections = <ParentSections />;
    //   break;
    default:
      sections = <div>잘못된 접근입니다.</div>;
  }

  return (
    <>
      <ColumnLayout.Left>
        <div className="border-line-line1 flex flex-col gap-9 rounded-xl border bg-white p-8">
          {basicInfoQuery.isLoading && (
            <div className="text-center">로딩중...</div>
          )}
          {basicInfoQuery.isError && (
            <div className="text-center">프로필 정보를 불러올 수 없습니다.</div>
          )}
          {basicInfoQuery.data && (
            <ProfileCard
              basicInfo={basicInfoQuery.data}
              teacherReport={teacherReportQuery.data}
            />
          )}
        </div>
      </ColumnLayout.Left>
      <ColumnLayout.Right className="desktop:max-w-[740px] desktop:px-8">
        <div className="flex flex-col gap-3">{sections}</div>
      </ColumnLayout.Right>
    </>
  );
}
