import { StudyConsultation } from '@/features/dashboard/components/study-consultation';

export default function StudyConsultationPage({
  searchParams,
}: {
  searchParams: { studentId: string; studyRoomId: string };
}) {
  return (
    <StudyConsultation
      initialStudentId={searchParams.studentId}
      initialStudyRoomId={searchParams.studyRoomId}
    />
  );
}
