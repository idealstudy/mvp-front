'use client';

import EditableProfileCard from '@/features/mypage/components/editable-profile-card';
import ParentSections from '@/features/mypage/components/parent-sections';
import StudentSections from '@/features/mypage/components/student-sections';
import TeacherSections from '@/features/mypage/components/teacher-sections';
import { ColumnLayout } from '@/layout';
import { useRole } from '@/shared/hooks';

export default function MypageMain() {
  const { role } = useRole();

  let sections;

  switch (role) {
    case 'ROLE_TEACHER':
      sections = <TeacherSections />;
      break;
    case 'ROLE_STUDENT':
      sections = <StudentSections />;
      break;
    case 'ROLE_PARENT':
      sections = <ParentSections />;
      break;
    default:
      return <div>잘못된 접근입니다.</div>;
  }

  return (
    <>
      <ColumnLayout.Left>
        <div className="border-line-line1 flex flex-col gap-9 rounded-xl border bg-white p-8">
          <EditableProfileCard role={role} />
        </div>
      </ColumnLayout.Left>
      <ColumnLayout.Right className="desktop:max-w-[740px] desktop:px-8">
        <div className="flex flex-col gap-3">{sections}</div>
      </ColumnLayout.Right>
    </>
  );
}
