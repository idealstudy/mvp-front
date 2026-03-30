import { notFound } from 'next/navigation';

import ConsultationWriteArea from '@/features/consultation/components/consultation-write-area';

type PageProps = {
  searchParams: Promise<{ teacherId?: string; studyRoomId?: string }>;
};

export default async function ConsultationNewPage({ searchParams }: PageProps) {
  const { teacherId, studyRoomId } = await searchParams;

  if (!teacherId) notFound();

  return (
    <ConsultationWriteArea
      teacherId={Number(teacherId)}
      studyRoomId={studyRoomId ? Number(studyRoomId) : undefined}
    />
  );
}
