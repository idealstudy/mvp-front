'use client';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import { getCommentProfileImageSrcByRoleLabel } from '@/entities/study-note-comment';
import { getProfileImageSrc } from '@/shared/constants';

interface CommentCardHeaderProps {
  profileImageSrc: string;
  authorName: string;
  roleLabel: string;
}

export const CommentCardHeader = ({
  profileImageSrc,
  authorName,
  roleLabel,
}: CommentCardHeaderProps) => {
  // 역할에 맞는 기본 이미지 계산
  const fallbackProfileImage = useMemo(
    () => getCommentProfileImageSrcByRoleLabel(roleLabel),
    [roleLabel]
  );

  const [imageSrc, setImageSrc] = useState(() =>
    getProfileImageSrc(profileImageSrc, fallbackProfileImage)
  );

  useEffect(() => {
    setImageSrc(getProfileImageSrc(profileImageSrc, fallbackProfileImage));
  }, [profileImageSrc, fallbackProfileImage]);

  const handleImageError = (): void => {
    setImageSrc(fallbackProfileImage);
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className="border-gray-12 h-9 w-9 shrink-0 overflow-hidden rounded-full border">
        <Image
          src={imageSrc}
          alt="프로필 이미지"
          width={36}
          height={36}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      </div>
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
