import type { ParentNoteDetail } from '@/entities/study-note';
import { StudyNoteQueryKey, repository } from '@/entities/study-note';
import type { StudyNoteDetail } from '@/features/dashboard/studynote/detail/type';
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

export const useParentStudyNoteDetailQuery = (
  studentId: number,
  teachingNoteId: number,
  options?: Partial<
    UseQueryOptions<
      ParentNoteDetail,
      Error,
      ParentNoteDetail,
      ReturnType<typeof StudyNoteQueryKey.parentDetail>
    >
  >
) => {
  const enabled =
    Number.isInteger(studentId) &&
    studentId > 0 &&
    Number.isInteger(teachingNoteId) &&
    teachingNoteId > 0 &&
    (options?.enabled ?? true);

  return useQuery({
    queryKey: StudyNoteQueryKey.parentDetail(studentId, teachingNoteId),
    queryFn: () => repository.getParentDetail(studentId, teachingNoteId),
    ...options,
    enabled,
  });
};
