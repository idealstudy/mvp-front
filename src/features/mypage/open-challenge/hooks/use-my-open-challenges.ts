import {
  type MyChallengeListParams,
  openChallengeKeys,
  repository,
} from '@/entities/open-challenge';
import { useQuery } from '@tanstack/react-query';

const PAGE_SIZE = 10;

export const useMyOpenChallenges = (params: MyChallengeListParams) =>
  useQuery({
    queryKey: openChallengeKeys.myList({ ...params, size: PAGE_SIZE }),
    queryFn: () => repository.getMyList({ ...params, size: PAGE_SIZE }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

export const useMyOpenChallengeDetail = (
  challengeId: string,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: openChallengeKeys.myDetail(challengeId),
    queryFn: () => repository.getMyDetail(challengeId),
    enabled: (options?.enabled ?? true) && challengeId.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
