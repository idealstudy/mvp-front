import { redirect } from 'next/navigation';

import MembersPanel from '@/features/member/members-panel';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function StudyNoteMemberPage({ params }: PageProps) {
  const { id } = await params;
  const studyRoomId = Number(id);
  if (isNaN(studyRoomId)) redirect('/');
  return <MembersPanel studyRoomId={studyRoomId} />;
}
