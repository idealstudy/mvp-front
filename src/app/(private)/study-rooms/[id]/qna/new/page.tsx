import BackLink from '@/features/dashboard/studynote/components/back-link';
import QnAWriteDetail from '@/features/qna/components/write/qna-write-detail';
import { ColumnLayout } from '@/layout/column-layout';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function QnAWritePage({ params }: Props) {
  const resolvedParams = await params;

  return (
    <div className="flex w-full flex-col">
      <BackLink />

      <ColumnLayout className="desktop:p-6 items-start gap-6">
        <QnAWriteDetail studyRoomId={Number(resolvedParams.id)} />
      </ColumnLayout>
    </div>
  );
}
