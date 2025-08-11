import { ColumnLayout } from '@/components/layout/column-layout';
import StudyNoteDetailMetaSection from '@/features/dashboard/studynote/detail/components/meta-section';

export default async function StudyNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  return (
    <ColumnLayout className="h-dvh">
      <StudyNoteDetailMetaSection id={resolvedParams.id} />
    </ColumnLayout>
  );
}
