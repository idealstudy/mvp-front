'use client';

import ParentSections from '@/features/mypage/profile/components/parent-sections';
import StudentSections from '@/features/mypage/profile/components/student-sections';
import TeacherSections from '@/features/mypage/profile/components/teacher-sections';
import { useMemberStore } from '@/store';

export default function ProfileMain() {
  const role = useMemberStore((state) => state.member?.role);

  if (!role) return;

  switch (role) {
    case 'ROLE_TEACHER':
      return <TeacherSections />;
    case 'ROLE_STUDENT':
      return <StudentSections />;
    case 'ROLE_PARENT':
      return <ParentSections />;
    default:
      return <div>잘못된 접근입니다.</div>;
  }
}
