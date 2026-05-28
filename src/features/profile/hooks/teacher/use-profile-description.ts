import { repository, teacherKeys } from '@/entities/teacher';
import { useQuery } from '@tanstack/react-query';

export const useTeacherProfileDescription = (teacherId: number) =>
  useQuery({
    queryKey: teacherKeys.profile.description(teacherId),
    queryFn: () => repository.profile.getProfileDescription(teacherId),
  });
