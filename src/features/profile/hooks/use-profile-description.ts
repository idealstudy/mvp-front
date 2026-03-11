import { repository, teacherKeys } from '@/entities/teacher';
import { useQuery } from '@tanstack/react-query';

export const useProfileDescription = (teacherId: number) =>
  useQuery({
    queryKey: teacherKeys.profile.description(teacherId),
    queryFn: () => repository.profile.getProfileDescription(teacherId),
  });
