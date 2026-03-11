import { repository, teacherKeys } from '@/entities/teacher';
import { useQuery } from '@tanstack/react-query';

export const useProfileCareers = (teacherId: number) =>
  useQuery({
    queryKey: teacherKeys.profile.careers(teacherId),
    queryFn: () => repository.profile.getProfileCareers(teacherId),
  });
