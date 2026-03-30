import { repository, teacherKeys } from '@/entities/teacher';
import { useQuery } from '@tanstack/react-query';

export function useTeacherStudyRooms(teacherId: number) {
  return useQuery({
    queryKey: teacherKeys.profile.studyRooms(teacherId),
    queryFn: () => repository.profile.getProfileStudyRooms(teacherId),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
