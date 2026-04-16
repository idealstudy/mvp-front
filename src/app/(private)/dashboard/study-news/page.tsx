import { StudyNews } from '@/features/dashboard/components/study-news';

export default function StudyNewsPage({
  searchParams,
}: {
  searchParams: { studentId?: string };
}) {
  return <StudyNews initialStudentId={searchParams.studentId} />;
}
