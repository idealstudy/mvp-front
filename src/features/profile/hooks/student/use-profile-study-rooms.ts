import { repository, studentKeys } from '@/entities/student';
import { useQuery } from '@tanstack/react-query';

export const useStudentProfileStudyRooms = (studentId: number) =>
  useQuery({
    queryKey: studentKeys.profile.studyRooms(studentId),
    queryFn: () => repository.profile.getProfileStudyRooms(studentId),
  });
