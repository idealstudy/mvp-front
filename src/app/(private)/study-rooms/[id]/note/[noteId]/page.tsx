import BackLink from '@/features/dashboard/studynote/components/back-link';
import { StudyNoteDetailContentsSection } from '@/features/dashboard/studynote/detail/components/contents-section';
import { StudyNoteDetailMetaSection } from '@/features/dashboard/studynote/detail/components/meta-section';
import { StudyNoteDetailCommentSection } from '@/features/study-note-comment/components';
import { ColumnLayout } from '@/layout/column-layout';
import { PageViewTracker } from '@/shared/components/gtm';

type Props = {
  params: Promise<{ id: string; noteId: string }>;
  searchParams: Promise<{ studentId?: string }>;
};

export default async function StudyNoteDetailPage({
  params,
  searchParams,
}: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <PageViewTracker pageName="studynote_detail" />
      <div className="w-full flex-col">
        <BackLink />
        <ColumnLayout className="desktop:p-6 items-start gap-6">
          <StudyNoteDetailMetaSection
            id={resolvedParams.noteId}
            studentId={resolvedSearchParams.studentId}
          />
          <StudyNoteDetailContentsSection
            id={resolvedParams.noteId}
            studentId={resolvedSearchParams.studentId}
          />
        </ColumnLayout>
        <ColumnLayout>
          <StudyNoteDetailCommentSection
            studyRoomId={resolvedParams.id}
            studyNoteId={resolvedParams.noteId}
          />
        </ColumnLayout>
      </div>
    </>
  );
}
