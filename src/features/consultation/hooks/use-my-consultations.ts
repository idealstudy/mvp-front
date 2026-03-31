import { consultationKeys, repository } from '@/entities/consultation';
import { useQuery } from '@tanstack/react-query';

const PAGE_SIZE = 10;

export const useMyConsultations = (page: number) =>
  useQuery({
    queryKey: consultationKeys.myList({ page, size: PAGE_SIZE }),
    queryFn: () => repository.getMyConsultations({ page, size: PAGE_SIZE }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
