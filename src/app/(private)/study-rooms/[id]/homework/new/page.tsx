import SelectArea from '@/features/dashboard/studynote/write/components/select-area';
import { HomeworkFormProvider } from '@/features/homework/components/write/components/homework-form-provider';
import { HomeworkWriteForm } from '@/features/homework/components/write/components/homework-write-form';
import { WriteArea } from '@/features/homework/components/write/components/write-area';
import { ColumnLayout } from '@/layout/column-layout';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StudyNoteHomeworkWritePage({ params }: Props) {
  const resolvedParams = await params;
  const studyRoomId = Number(resolvedParams.id);

  return (
    <>
      <HomeworkFormProvider studyRoomId={studyRoomId}>
        <HomeworkWriteForm>
          <ColumnLayout className="pb-10">
            <SelectArea />
            <WriteArea />
          </ColumnLayout>
        </HomeworkWriteForm>
      </HomeworkFormProvider>
    </>
  );
}
