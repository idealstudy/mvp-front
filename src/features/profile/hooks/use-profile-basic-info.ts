import { repository, teacherKeys } from '@/entities/teacher';
import { useQuery } from '@tanstack/react-query';

export const useProfileBasicInfo = (
  teacherId: number,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: teacherKeys.profile.basicInfo(teacherId),
    queryFn: () => repository.profile.getProfileBasicInfo(teacherId),
    enabled: options?.enabled ?? true,
  });
