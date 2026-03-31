'use client';

import { useState } from 'react';

import Image from 'next/image';

import { ConsultationDialogs } from '@/features/member/components/consultation-dialog';
import MembersDropdown from '@/features/member/components/members-dropdown';
import { StudyNoteMember } from '@/features/study-notes/model';
import { EditIcon } from '@/shared/components/icons';
import { cn } from '@/shared/lib';

type Props = {
  member: StudyNoteMember;
  isHighlighted?: boolean;
  studyRoomId: number;
  isTeacher: boolean;
  currentUserId?: number;
  consultationCount: number;
};

const maskEmail = (email: string) => {
  const atIndex = email.indexOf('@');
  return `${email[0]}***${email.slice(atIndex)}`;
};

export const MemberListItem = ({
  member,
  isHighlighted,
  studyRoomId,
  isTeacher,
  currentUserId,
  consultationCount,
}: Props) => {
  const isCurrentUser = member.id === String(currentUserId);
  const displayEmail =
    !isTeacher && !isCurrentUser ? maskEmail(member.email) : member.email;

  const isParent = member.role === 'ROLE_PARENT';
  const [dialogView, setDialogView] = useState<'none' | 'list' | 'form'>(
    'none'
  );

  return (
    <li
      className={cn(
        'tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-4 flex flex-col gap-3 px-4 py-3',
        isHighlighted && 'bg-zinc-100/70'
      )}
    >
      {/* Left: avatar + info */}
      <div className="flex min-w-0 items-center gap-3">
        <Image
          src={member.avatarSrc ?? '/character/img_profile_student01.png'}
          alt={`${member.name} 프로필`}
          width={36}
          height={36}
          className="border-gray-12 h-9 w-9 rounded-full border-1 object-contain"
        />
        <div className="min-w-0">
          {/* Row 1: name + role badge */}
          <div className="flex items-center gap-2">
            <p className="font-body2-normal text-gray-12 truncate">
              {member.name}
            </p>
            <span className="font-body2-normal text-gray-7">
              · {isParent ? '학부모' : '학생'}
            </span>
          </div>

          {/* Row 2: D+N · join date · email · status */}
          <div className="flex flex-wrap items-center gap-x-1.5">
            <span className="font-caption-heading text-orange-6">
              D+{member.dday}
            </span>
            <span className="font-caption-normal text-gray-8">
              {member.isTerminated
                ? `${member.outText} 종료`
                : `${member.joinText} 가입`}
            </span>
            <span className="font-caption-normal text-gray-6">|</span>
            <span className="font-caption-normal text-gray-6 truncate">
              {displayEmail}
            </span>
            <span
              className={cn(
                'font-caption-heading rounded-sm px-2 py-1',
                member.isTerminated
                  ? 'bg-gray-2 text-gray-7'
                  : 'bg-orange-2 text-orange-7'
              )}
            >
              {member.isTerminated ? '수업 종료' : '참여 중'}
            </span>
          </div>
        </div>
      </div>

      {/* Right: 기록 badge + 기록 button + dropdown */}
      {(isTeacher || isCurrentUser) && (
        <div className="tablet:gap-2 tablet:self-auto flex shrink-0 items-center gap-1.5 self-end">
          {consultationCount > 0 && (
            <div className="border-gray-5 font-caption-normal tablet:font-label-normal tablet:px-[11px] tablet:py-[3px] inline-flex items-center rounded-full border px-2.5 py-0.5">
              기록 {consultationCount}
            </div>
          )}
          <div className="tablet:gap-1 flex gap-0.5">
            <button
              type="button"
              className="text-gray-5 hover:bg-gray-1 flex items-center justify-center rounded-md"
              onClick={() => setDialogView('list')}
            >
              <EditIcon
                size={20}
                className="tablet:hidden"
              />
              <EditIcon
                size={24}
                className="tablet:block hidden"
              />
            </button>
            <MembersDropdown
              studyRoomId={studyRoomId}
              memberId={member.id}
              isTerminated={member.isTerminated}
            />
          </div>
        </div>
      )}

      {(dialogView === 'list' || dialogView === 'form') && (
        <ConsultationDialogs
          key={dialogView}
          studyRoomId={studyRoomId}
          studentId={member.id}
          studentName={member.name}
          initialView={dialogView}
          isOpen
          isTeacher={isTeacher}
          onClose={() => setDialogView('none')}
        />
      )}
    </li>
  );
};
