import { ColumnLayout } from '@/components/layout/column-layout';

export default async function StudyRoomDetailPage() {
  return (
    <main>
      <ColumnLayout>
        <ColumnLayout.Left className="h-[400px] rounded-[12px] bg-gray-200" />
        <ColumnLayout.Right className="h-[4000px] rounded-[12px] bg-gray-200" />
      </ColumnLayout>
    </main>
  );
}
