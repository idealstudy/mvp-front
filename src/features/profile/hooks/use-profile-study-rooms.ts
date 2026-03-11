import { repository, teacherKeys } from '@/entities/teacher';
import { useQuery } from '@tanstack/react-query';

export const useProfileStudyRooms = (teacherId: number) =>
  useQuery({
    queryKey: teacherKeys.profile.studyRooms(teacherId),
    queryFn: () => repository.profile.getProfileStudyRooms(teacherId),
  });
