'use client';

import { Role } from '@/entities/member';
import { FrontendTeacherBasicInfo } from '@/entities/teacher';
import ProfileCard from '@/features/profile/components/profile-card/profile-card';
import TeacherSections from '@/features/profile/components/teacher-sections';
import { useProfileReport } from '@/features/profile/hooks/use-profile-report';
import { ColumnLayout } from '@/layout';

export default function ProfileMain({
  basicInfo,
  memberId,
  role,
}: {
  basicInfo?: FrontendTeacherBasicInfo;
  memberId: number;
  role: Role;
}) {
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
          {basicInfo && (
            <ProfileCard
              basicInfo={basicInfo}
              teacherReport={teacherReportQuery.data}
              memberId={memberId}
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
