import { ColumnLayout } from '@/components/layout/column-layout';
import StudyNoteDetailMetaSection from '@/features/dashboard/studynote/detail/components/meta-section';

export default async function SettingsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <ColumnLayout className="h-dvh">
      <StudyNoteDetailMetaSection id={params.id} />
      {/* <StudyNoteDetailContentsSection id={params.id} /> */}
    </ColumnLayout>
  );
}
