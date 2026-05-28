import { repository, studentKeys } from '@/entities/student';
import { useQuery } from '@tanstack/react-query';

export const useStudentProfileReport = (studentId: number) =>
  useQuery({
    queryKey: studentKeys.profile.report(studentId),
    queryFn: () => repository.profile.getProfileReport(studentId),
  });
