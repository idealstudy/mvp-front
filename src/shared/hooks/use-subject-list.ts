import { SubjectQueryKey, subjectRepository } from '@/entities/subject';
import { useQuery } from '@tanstack/react-query';

export const useSubjectList = () => {
  return useQuery({
    queryKey: SubjectQueryKey.list(),
    queryFn: subjectRepository.getList,
    staleTime: Infinity,
  });
};
