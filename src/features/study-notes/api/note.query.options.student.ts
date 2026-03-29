import { StudyNoteQueryKey } from '@/entities/study-note';
import {
  StudentNotesApi,
  createNotesListQueryOptions,
} from '@/features/study-notes/api';
import { queryConfig } from '@/shared/lib';
import { BaseQueryOptions } from '@/shared/lib/query/types';
import { queryOptions } from '@tanstack/react-query';

export type StudentQueryOptions = ReturnType<
  typeof createStudentNoteQueryOptions
>;

export type StudentNotesApiWithOptionalDetail = StudentNotesApi & {
  getDetail?: (teachingNoteId: number) => Promise<unknown>;
};

export const createStudentNoteQueryOptions = (
  api: StudentNotesApiWithOptionalDetail,
  base: BaseQueryOptions = {}
) => {
  const opt = { ...queryConfig.DEFAULT_QUERY_OPTION, ...base };
  const common = createNotesListQueryOptions(api, opt);

  const members = (args: {
    studyRoomId: number;
    page?: number;
    size?: number;
    enabled?: boolean;
  }) => {
    const page = args.page ?? 0;
    const size = args.size ?? 20;
    return queryOptions({
      queryKey: StudyNoteQueryKey.members(args.studyRoomId, page, size),
      queryFn: () =>
        api.getMembers({ studyRoomId: args.studyRoomId, page, size }),
      ...opt,
      enabled: args.enabled ?? true,
    });
  };

  return { ...common, members };
};
