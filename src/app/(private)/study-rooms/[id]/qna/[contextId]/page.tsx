import BackLink from '@/features/dashboard/studynote/components/back-link';
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
    <div className="flex w-full flex-col">
      <BackLink />

      <ColumnLayout className="desktop:p-6 items-start gap-6">
        <QuestionDetail
          studyRoomId={studyRoomId}
          contextId={contextId}
        />
      </ColumnLayout>
    </div>
  );
}
