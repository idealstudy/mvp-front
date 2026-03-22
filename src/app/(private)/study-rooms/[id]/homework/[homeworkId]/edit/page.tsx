import SelectArea from '@/features/dashboard/studynote/write/components/select-area';
import HomeworkEditForm from '@/features/homework/components/write/components/homework-edit-form';
import { HomeworkFormProvider } from '@/features/homework/components/write/components/homework-form-provider';
import { WriteArea } from '@/features/homework/components/write/components/write-area';
import { ColumnLayout } from '@/layout/column-layout';

type Props = {
  params: Promise<{ id: string; homeworkId: string }>;
};

export default async function HomeworkEditPage({ params }: Props) {
  const resolvedParams = await params;
  const studyRoomId = Number(resolvedParams.id);
  const homeworkId = Number(resolvedParams.homeworkId);

  return (
    <>
      <HomeworkFormProvider
        studyRoomId={studyRoomId}
        homeworkId={homeworkId}
        isEditMode={true}
      >
        <HomeworkEditForm
          homeworkId={homeworkId}
          studyRoomId={studyRoomId}
        >
          <ColumnLayout className="pb-10">
            <SelectArea />
            <WriteArea isEditMode={true} />
          </ColumnLayout>
        </HomeworkEditForm>
      </HomeworkFormProvider>
    </>
  );
}
