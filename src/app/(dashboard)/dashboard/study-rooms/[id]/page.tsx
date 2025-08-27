import { ColumnLayout } from '@/components/layout/column-layout';
import { StudyNotes } from '@/features/studyrooms/studynotes';

export default async function StudyRoomDetailPage() {
  return (
    <main>
      <ColumnLayout>
        <ColumnLayout.Left className="h-[400px] rounded-[12px] bg-gray-200" />
        <ColumnLayout.Right className="desktop:max-w-[740px] h-[400px] rounded-[12px] bg-white px-8 py-6">
          <StudyNotes />
        </ColumnLayout.Right>
      </ColumnLayout>
    </main>
  );
}
