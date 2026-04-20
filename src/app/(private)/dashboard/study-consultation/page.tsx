import { StudyConsultation } from '@/features/dashboard/components/study-consultation';

export default async function StudyConsultationPage({
  searchParams,
}: {
  searchParams: Promise<{ studentId: string; studyRoomId: string }>;
}) {
  const { studentId, studyRoomId } = await searchParams;

  return (
    <StudyConsultation
      initialStudentId={studentId}
      initialStudyRoomId={studyRoomId}
    />
  );
}
