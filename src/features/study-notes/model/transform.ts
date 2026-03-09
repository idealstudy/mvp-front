import {
  StudyNoteMember,
  StudyNoteMemberResponse,
} from '@/features/study-notes/model';

export const transformMembersData = (
  data?: StudyNoteMemberResponse['data']
): StudyNoteMember[] => {
  if (!data?.members) return [];

  return data.members.map((member) => ({
    id: member.studentInfo.id.toString(),
    name: member.studentInfo.name,
    email: member.studentInfo.email,
    joinedText: new Date(member.studentInfo.joinDate).toLocaleDateString(
      'ko-KR'
    ),
    guardianCount: member.parentInfo ? 1 : 0,
    isTerminated: member.studentInfo.outDate !== null,
  }));
};
