'use client';

import React, { useState } from 'react';

import Image from 'next/image';

import { UserBasicInfo } from '@/entities/member/types';
import { FrontendTeacherReport } from '@/entities/teacher';
import ParentProfileExtra from '@/features/profile/components/profile-card/parent-profile-extra';
import StudentProfileExtra from '@/features/profile/components/profile-card/student-profile-extra';
import TeacherProfileExtra from '@/features/profile/components/profile-card/teacher-profile-extra';
import { Button, Dialog } from '@/shared/components/ui';
import {
  DEFAULT_PROFILE_IMAGE,
  PUBLIC,
  getProfileImageSrc,
} from '@/shared/constants';
import { ExternalLink } from 'lucide-react';

export default function ProfileCard({
  basicInfo,
  teacherReport,
  action,
  memberId,
}: {
  basicInfo: UserBasicInfo;
  teacherReport?: FrontendTeacherReport;
  action?: React.ReactNode;
  memberId?: number;
}) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const profileImageUrl = getProfileImageSrc(
    basicInfo.profileImageUrl,
    DEFAULT_PROFILE_IMAGE.COMMON
  );

  const handleShareProfile = () => {
    if (!memberId) return;

    let profileUrl;
    switch (basicInfo.role) {
      case 'ROLE_TEACHER':
        profileUrl = PUBLIC.PROFILE.TEACHER(memberId);
        break;
      case 'ROLE_STUDENT':
        profileUrl = PUBLIC.PROFILE.STUDENT(memberId);
        break;
      default:
        return;
    }
    navigator.clipboard.writeText(`${window.location.origin}${profileUrl}`);

    setIsShareDialogOpen(true);
  };

  let profileExtra;

  switch (basicInfo.role) {
    case 'ROLE_TEACHER':
      if (!memberId) return null;
      if (teacherReport) {
        profileExtra = (
          <TeacherProfileExtra
            teacherNoteCount={teacherReport.teachingNoteCount}
            studentCount={teacherReport.studentCount}
            reviewCount={teacherReport.reviewCount}
            description={basicInfo.simpleIntroduction || ''}
            teacherId={memberId}
          />
        );
      }
      break;
    case 'ROLE_STUDENT':
      profileExtra = (
        <StudentProfileExtra learningGoal={basicInfo.learningGoal || ''} />
      );
      break;
    case 'ROLE_PARENT':
      profileExtra = <ParentProfileExtra />;
      break;
  }

  return (
    <>
      <div className="flex gap-3">
        <Image
          src={profileImageUrl}
          width={70}
          height={70}
          alt={`${basicInfo.name}님의 프로필 이미지`}
          className="aspect-square self-center rounded-full border border-gray-400 object-cover"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-title-heading truncate">{basicInfo.name}</h3>
            {action ? (
              action
            ) : (
              <button
                type="button"
                onClick={handleShareProfile}
                aria-label="프로필 공유하기"
                className="cursor-pointer"
              >
                <ExternalLink />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <span className="text-text-sub2 bg-background-gray font-label-normal content-center rounded-sm px-2">
              {basicInfo.profilePublicKorean}
            </span>
            {basicInfo.role === 'ROLE_TEACHER' && basicInfo.isEmailPublic && (
              <p className="font-label-normal text-gray-7">{basicInfo.email}</p>
            )}
          </div>
        </div>
      </div>

      {profileExtra}

      {/* 공유하기 다이얼로그 */}
      <Dialog
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
      >
        <Dialog.Content className="max-w-120">
          <Dialog.Body className="mb-8 text-center">
            <Dialog.Title>링크가 복사되었습니다.</Dialog.Title>
          </Dialog.Body>
          <Dialog.Footer className="flex justify-center">
            <Dialog.Close asChild>
              <Button
                size="xsmall"
                className="w-30"
              >
                확인
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
