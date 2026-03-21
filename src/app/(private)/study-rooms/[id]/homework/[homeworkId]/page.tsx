import HomeworkDetailRoleSwitch from '@/features/homework/components/detail/homework-detail-role-switch';

type Props = {
  params: Promise<{ id: string; homeworkId: string }>;
};

export default async function HomeworkDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const studyRoomId = Number(resolvedParams.id);
  const homeworkId = Number(resolvedParams.homeworkId);

  return (
    <HomeworkDetailRoleSwitch
      studyRoomId={studyRoomId}
      homeworkId={homeworkId}
    />
  );
}
