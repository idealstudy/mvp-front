import React from 'react';

import Image from 'next/image';

import { UserBasicInfo } from '@/features/mypage/types';
import StudentProfileExtra from '@/features/profile/components/profile-card/student-profile-extra';
import TeacherProfileExtra from '@/features/profile/components/profile-card/teacher-profile-extra';

export default function ProfileCard({
  basicInfo,
  action,
}: {
  basicInfo: UserBasicInfo;
  action?: React.ReactNode;
}) {
  let profileExtra;

  switch (basicInfo.role) {
    case 'ROLE_TEACHER':
      profileExtra = (
        <TeacherProfileExtra
          teacherNoteCount={0}
          studentCount={0}
          reviewCount={0}
          description={basicInfo.simpleIntroduction || ''}
        />
      );
      break;
    case 'ROLE_STUDENT':
      profileExtra = (
        <StudentProfileExtra learningGoal={basicInfo.learningGoal || ''} />
      );
      break;
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-headline1-heading">{basicInfo.name}</h3>
          <span className="text-text-sub2 bg-background-gray font-label-normal mr-auto content-center rounded-sm px-2">
            {basicInfo.profilePublicKorean}
          </span>

          {action && action}
        </div>
        <p>{basicInfo.email}</p>
      </div>

      <Image
        src={'/character/img_signup_type01.png'}
        width={280}
        height={280}
        alt={`${basicInfo.name}님의 프로필 이미지`}
        className="aspect-square self-center rounded-full border border-gray-400 object-cover"
      />

      {profileExtra}
    </>
  );
}
