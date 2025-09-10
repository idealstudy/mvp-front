import type { StudyNoteDetail } from '@/features/dashboard/studynote/detail/tyoe';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getStudyNoteDetailOption } from './query-options';

export const useStudyNoteDetailQuery = (
  id: number,
  options?: Partial<
    UseQueryOptions<
      StudyNoteDetail,
      Error,
      StudyNoteDetail,
      (string | number)[]
    >
  >
) => {
  return useQuery({
    ...getStudyNoteDetailOption(id),
    ...options,
  });
};
