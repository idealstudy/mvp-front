import BackLink from '@/features/dashboard/studynote/components/back-link';
import { QuestionDetail } from '@/features/qna/components/detail/qna-detail';
import { ColumnLayout } from '@/layout/column-layout';

type Props = {
  params: Promise<{ id: string; contextId: string }>;
  searchParams: Promise<{ studentId?: string }>;
};

export default async function QuestionDetailPage({
  params,
  searchParams,
}: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const studyRoomId = Number(resolvedParams.id);
  const contextId = Number(resolvedParams.contextId);
  const studentId = resolvedSearchParams.studentId
    ? Number(resolvedSearchParams.studentId)
    : undefined;

  return (
    <div className="flex w-full flex-col">
      <BackLink />

      <ColumnLayout className="desktop:p-6 items-start gap-6">
        <QuestionDetail
          studyRoomId={studyRoomId}
          contextId={contextId}
          studentId={studentId}
        />
      </ColumnLayout>
    </div>
  );
}
