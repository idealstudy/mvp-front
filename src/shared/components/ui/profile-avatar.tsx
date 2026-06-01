'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import type { Role } from '@/entities/member/types';
import {
  DEFAULT_PROFILE_IMAGE,
  PUBLIC,
  getProfileImageSrc,
} from '@/shared/constants';
import { cn } from '@/shared/lib';

import { DropdownMenu } from './dropdown-menu';

interface ProfileAvatarProps {
  src?: string | null;
  fallbackSrc?: string;
  alt: string;
  size?: number;
  memberId?: number;
  role?: Role;
  className?: string;
}

const getProfileHref = (memberId?: number, role?: Role): string | null => {
  if (!memberId || !role) return null;
  if (role === 'ROLE_TEACHER') return PUBLIC.PROFILE.TEACHER(memberId);
  if (role === 'ROLE_STUDENT') return PUBLIC.PROFILE.STUDENT(memberId);
  return null;
};

export const ProfileAvatar = ({
  src,
  fallbackSrc = DEFAULT_PROFILE_IMAGE.COMMON,
  alt,
  size = 40,
  memberId,
  role,
  className,
}: ProfileAvatarProps) => {
  const [imageSrc, setImageSrc] = useState(() =>
    getProfileImageSrc(src, fallbackSrc)
  );

  useEffect(() => {
    setImageSrc(getProfileImageSrc(src, fallbackSrc));
  }, [src, fallbackSrc]);

  const href = getProfileHref(memberId, role);

  const avatar = (
    <Image
      src={imageSrc}
      alt={alt}
      width={size}
      height={size}
      className={cn('rounded-full object-cover', className)}
      onError={() => setImageSrc(fallbackSrc)}
    />
  );

  if (!href) return avatar;

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="cursor-pointer"
        >
          {avatar}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        <DropdownMenu.Item asChild>
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            프로필 보기
          </Link>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
