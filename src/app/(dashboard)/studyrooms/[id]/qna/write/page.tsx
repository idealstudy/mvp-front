import { ColumnLayout } from '@/components/layout/column-layout';
import QnAWriteDetail from '@/features/qna/components/write/qna-write-detail';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function QnAWritePage({ params }: Props) {
  const resolvedParams = await params;

  return (
    <main>
      <ColumnLayout>
        <QnAWriteDetail studyRoomId={Number(resolvedParams.id)} />
      </ColumnLayout>
    </main>
  );
}
