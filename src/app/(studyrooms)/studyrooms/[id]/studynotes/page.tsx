import { ColumnLayout } from '@/components/layout/column-layout';
import { StudyroomSidebar } from '@/features/studyroom/components/sidebar';

export default async function StudyRoomDetailPage() {
  return (
    <main>
      <ColumnLayout>
        <StudyroomSidebar />
        <ColumnLayout.Right className="h-[4000px] rounded-[12px] bg-gray-200" />
      </ColumnLayout>
    </main>
  );
}
