import { notFound } from 'next/navigation';

import BackLink from '@/features/dashboard/studynote/components/back-link';
import { StudyroomPreviewContents } from '@/features/study-room-preview/components/contents';
import { StudyroomPreviewSidebar } from '@/features/study-room-preview/components/sidebar';
import { ColumnLayout } from '@/layout';
import { ScrollToTopButton } from '@/shared/components/ui';

type PageProps = {
  params: Promise<{ id: string; teacherId: string }>;
};

export default async function StudyRoomDetailPage({ params }: PageProps) {
  const { id, teacherId } = await params;

  const studyRoomId = Number(id);
  const teacherIdNum = Number(teacherId);

  if (!Number.isInteger(studyRoomId) || studyRoomId <= 0) notFound();
  if (!Number.isInteger(teacherIdNum) || teacherIdNum <= 0) notFound();

  return (
    <>
      <div className="flex w-full flex-col">
        <BackLink />
        <div className="desktop:flex-row mt-4 flex flex-col gap-5">
          <ColumnLayout.Left className="border-line-line1 flex h-fit flex-col gap-5 rounded-xl border bg-white px-8 py-8">
            <StudyroomPreviewSidebar
              teacherId={teacherIdNum}
              studyRoomId={studyRoomId}
            />
          </ColumnLayout.Left>
          <ColumnLayout.Right className="desktop:max-w-[740px]">
            <StudyroomPreviewContents
              studyRoomId={studyRoomId}
              teacherId={teacherIdNum}
            />
          </ColumnLayout.Right>
          <ScrollToTopButton />
        </div>
      </div>
    </>
  );
}
