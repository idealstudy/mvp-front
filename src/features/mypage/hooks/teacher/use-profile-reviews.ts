import { repository, teacherKeys } from '@/entities/teacher';
import { useQuery } from '@tanstack/react-query';

export const useProfileReviews = (teacherId: number) =>
  useQuery({
    queryKey: teacherKeys.profile.reviews(teacherId),
    queryFn: () => repository.profile.getProfileReviews(teacherId),
  });
