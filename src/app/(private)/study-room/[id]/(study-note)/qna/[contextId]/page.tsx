import { QuestionDetail } from '@/features/qna/components/detail/qna-detail';
import { ColumnLayout } from '@/layout/column-layout';

type Props = {
  params: Promise<{ id: string; contextId: string }>;
};

export default async function QuestionDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const studyRoomId = Number(resolvedParams.id);
  const contextId = Number(resolvedParams.contextId);

  return (
    <main>
      <ColumnLayout>
        <QuestionDetail
          studyRoomId={studyRoomId}
          contextId={contextId}
        />
      </ColumnLayout>
    </main>
  );
}
