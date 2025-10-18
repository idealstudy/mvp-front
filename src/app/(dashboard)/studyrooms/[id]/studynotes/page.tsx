import { ColumnLayout } from '@/components/layout/column-layout';
import { StudyRoomDetail } from '@/features/studyrooms/components/detail/study-room-detail';

export default async function StudyRoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  return (
    <main>
      <ColumnLayout>
        <StudyRoomDetail studyRoomId={Number(resolvedParams.id)} />
      </ColumnLayout>
    </main>
  );
}
