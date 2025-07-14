export default async function StudyRoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <main>스터디룸 상세 {id}</main>;
}
