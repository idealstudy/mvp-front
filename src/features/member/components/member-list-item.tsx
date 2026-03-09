import Image from 'next/image';

import MembersDropdown from '@/features/member/components/members-dropdown';
import { StudyNoteMember } from '@/features/study-notes/model';

type Props = {
  member: StudyNoteMember;
  isHighlighted?: boolean;
  studyRoomId: number;
};

export const MemberListItem = ({
  member,
  isHighlighted,
  studyRoomId,
}: Props) => {
  return (
    <li
      className={`flex items-center justify-between gap-4 px-4 py-3 hover:bg-zinc-50 ${isHighlighted ? 'bg-zinc-100/70' : ''} `}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Image
          src={member.avatarSrc ?? '/studynotes/student.svg'}
          alt={`${member.name} 프로필`}
          width={36}
          height={36}
          className="h-9 w-9 rounded-full object-cover ring-1 ring-black/5"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-zinc-900">
              {member.name}
            </p>
            {member.guardianCount ? (
              <span className="inline-flex items-center rounded-full bg-red-50 px-1.5 py-0.5 text-[11px] font-semibold text-red-500 ring-1 ring-red-100">
                보호자 {member.guardianCount}
              </span>
            ) : null}
          </div>
          <p className="truncate text-xs text-zinc-500">{member.email}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="text-xs text-zinc-500">{member.joinedText}</span>
        <span
          className={`w-16 rounded-lg px-2 py-1 text-center text-xs ${
            member.isTerminated
              ? 'bg-gray-1 text-gray-7'
              : 'bg-background-orange text-key-color-primary'
          }`}
        >
          {member.isTerminated ? '수업 종료' : '참여 중'}
        </span>
        <MembersDropdown
          studyRoomId={studyRoomId}
          memberId={member.id}
          isTerminated={member.isTerminated}
        />
      </div>
    </li>
  );
};
