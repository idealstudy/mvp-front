import { repository, teacherKeys } from '@/entities/teacher';
import { useQuery } from '@tanstack/react-query';

export const useProfileTeachingNotes = (teacherId: number) =>
  useQuery({
    queryKey: teacherKeys.profile.teachingNotes(teacherId),
    queryFn: () => repository.profile.getProfileTeachingNotes(teacherId),
  });
