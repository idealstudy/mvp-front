import { ColumnLayout } from '@/layout/column-layout';

export default function StudyRoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <ColumnLayout>{children} </ColumnLayout>
    </main>
  );
}
