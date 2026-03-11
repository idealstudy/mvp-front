import { repository, teacherKeys } from '@/entities/teacher';
import { useQuery } from '@tanstack/react-query';

export const useProfileReport = (
  teacherId: number,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: teacherKeys.profile.report(teacherId),
    queryFn: () => repository.profile.getProfileReport(teacherId),
    enabled: options?.enabled ?? true,
  });
