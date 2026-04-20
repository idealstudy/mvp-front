import { StudyNews } from '@/features/dashboard/components/study-news';

export default async function StudyNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string }>;
}) {
  const { studentId } = await searchParams;

  return <StudyNews initialStudentId={studentId} />;
}
