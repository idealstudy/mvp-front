'use client';

import { useMemo } from 'react';

import type { Role } from '@/entities/member/types';
import { getCommentProfileImageSrcByRoleLabel } from '@/entities/study-note-comment';
import { ProfileAvatar } from '@/shared/components/ui/profile-avatar';

const roleLabelToRole = (roleLabel: string): Role | undefined => {
  if (roleLabel === '선생님') return 'ROLE_TEACHER';
  if (roleLabel === '학생') return 'ROLE_STUDENT';
  return undefined;
};

interface CommentCardHeaderProps {
  profileImageSrc: string;
  authorName: string;
  roleLabel: string;
  authorId?: number;
}

export const CommentCardHeader = ({
  profileImageSrc,
  authorName,
  roleLabel,
  authorId,
}: CommentCardHeaderProps) => {
  // 역할에 맞는 기본 이미지 계산
  const fallbackProfileImage = useMemo(
    () => getCommentProfileImageSrcByRoleLabel(roleLabel),
    [roleLabel]
  );

  return (
    <div className="flex items-center gap-2.5">
      <ProfileAvatar
        src={profileImageSrc}
        fallbackSrc={fallbackProfileImage}
        alt="프로필 이미지"
        size={36}
        memberId={authorId}
        role={roleLabelToRole(roleLabel)}
        className="border-gray-12 h-9 w-9 shrink-0 border"
      />
      <div className="flex items-center gap-1">
        <p className="font-body2-normal text-gray-12">
          {roleLabel === '선생님' ? '선생님' : authorName}
        </p>
        {roleLabel === '학생' && (
          <>
            <p className="text-gray-7">·</p>
            <p className="font-body2-normal text-gray-7">{roleLabel}</p>
          </>
        )}
      </div>
    </div>
  );
};
