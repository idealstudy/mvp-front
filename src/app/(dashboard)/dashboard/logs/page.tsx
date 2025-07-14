import { ColumnLayout } from '@/components/layout/column-layout';

export default function LogListPage() {
  return (
    <ColumnLayout>
      <ColumnLayout.Left className="h-[400px] rounded-[12px] bg-gray-200" />
      <ColumnLayout.Right className="h-[4000px] rounded-[12px] bg-gray-200" />
    </ColumnLayout>
  );
}
