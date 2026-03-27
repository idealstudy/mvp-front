import {
  StudyNoteMember,
  StudyNoteMemberResponse,
} from '@/features/study-notes/model';
import { formatDateDot, getDaysSince } from '@/shared/lib';

export const transformMembersData = (
  data?: StudyNoteMemberResponse['data']
): StudyNoteMember[] => {
  if (!data?.members) return [];

  return data.members.flatMap((member) => {
    const toMember = (
      info: typeof member.studentInfo,
      guardianCount?: number
    ): StudyNoteMember => ({
      id: info.id.toString(),
      name: info.name,
      email: info.email,
      role: info.role as StudyNoteMember['role'],
      dday: getDaysSince(info.joinDate, info.outDate),
      joinText: formatDateDot(info.joinDate),
      outText: info.outDate ? formatDateDot(info.outDate) : null,
      guardianCount,
      isTerminated: info.outDate !== null,
    });

    const entries: StudyNoteMember[] = [
      toMember(member.studentInfo, member.parentInfo ? 1 : 0),
    ];

    if (member.parentInfo) {
      entries.push(toMember(member.parentInfo));
    }

    return entries;
  });
};
