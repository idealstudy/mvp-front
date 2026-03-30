import { repository, teacherKeys } from '@/entities/teacher';
import { useQuery } from '@tanstack/react-query';

export function useTeacherProfile(teacherId: number) {
  return useQuery({
    queryKey: teacherKeys.profile.basicInfo(teacherId),
    queryFn: () => repository.profile.getProfileBasicInfo(teacherId),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
