import { ColumnLayout } from '@/components/layout/column-layout';
import { StudyroomSidebar } from '@/features/studyrooms/components/sidebar';
import { StudyNotes } from '@/features/studyrooms/components/studynotes';
import { StudyRoomTabs } from '@/features/studyrooms/components/taps';

export default function StudyRoomDetailPage() {
  return (
    <main>
      <ColumnLayout>
        <ColumnLayout.Left className="h-[400px] rounded-[12px] bg-gray-200" />
        <StudyroomSidebar />
        <ColumnLayout.Right className="desktop:max-w-[740px] flex h-[400px] flex-col gap-3 rounded-[12px] px-8 py-6">
          <StudyRoomTabs />
          <StudyNotes />
        </ColumnLayout.Right>
      </ColumnLayout>
    </main>
  );
}
