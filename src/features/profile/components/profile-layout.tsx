import { UserBasicInfo } from '@/features/mypage/types';
import ProfileCard from '@/features/profile/components/profile-card/profile-card';
import TeacherSections from '@/features/profile/components/teacher-sections';
import { ColumnLayout } from '@/layout';

export default function ProfileLayout({
  basicInfo,
}: {
  basicInfo: UserBasicInfo;
}) {
  let sections;

  switch (basicInfo.role) {
    case 'ROLE_TEACHER':
      sections = <TeacherSections />;
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
          <ProfileCard basicInfo={basicInfo} />
        </div>
      </ColumnLayout.Left>
      <ColumnLayout.Right className="desktop:max-w-[740px] desktop:px-8">
        <div className="flex flex-col gap-3">{sections}</div>
      </ColumnLayout.Right>
    </>
  );
}
