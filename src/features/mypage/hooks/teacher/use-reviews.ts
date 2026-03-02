import { ReviewListQuery, repository, teacherKeys } from '@/entities/teacher';
import { useQuery } from '@tanstack/react-query';

/**
 * [GET] 선생님 리뷰 조회
 */
export const useTeacherReviews = (
  params: ReviewListQuery,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: teacherKeys.review(params),
    queryFn: () => repository.getTeacherReviewList(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
