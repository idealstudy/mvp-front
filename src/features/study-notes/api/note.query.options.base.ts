import { StudyNoteQueryKey } from '@/entities/study-note';
import type { StudyNoteGroupPageable } from '@/features/study-notes/model';
import { BaseQueryOptions, queryConfig } from '@/shared/lib/query';
import { queryOptions } from '@tanstack/react-query';

// 공통 api
export type NotesListApi<TList> = {
  getNotes(args: {
    studyRoomId: number;
    pageable: StudyNoteGroupPageable;
  }): Promise<TList>;
  getNotesByGroup(args: {
    studyRoomId: number;
    teachingNoteGroupId: number;
    pageable: StudyNoteGroupPageable;
  }): Promise<TList>;
  getDetail(teachingNoteId: number): Promise<unknown>;
};

// 공통 옵션 팩토리
export const createNotesListQueryOptions = <TList>(
  api: NotesListApi<TList>,
  base: BaseQueryOptions = {}
) => {
  const opt = { ...queryConfig.DEFAULT_QUERY_OPTION, ...base };

  const list = (args: {
    studyRoomId: number;
    pageable: StudyNoteGroupPageable;
    enabled?: boolean;
  }) => {
    const {
      studyRoomId,
      pageable: { page, size, sortKey },
      enabled = true,
    } = args;
    return queryOptions({
      queryKey: StudyNoteQueryKey.list(studyRoomId, page, size, sortKey),
      queryFn: () =>
        api.getNotes({ studyRoomId, pageable: { page, size, sortKey } }),
      enabled,
      ...opt,
    });
  };

  const byGroup = (args: {
    studyRoomId: number;
    teachingNoteGroupId: number;
    pageable: StudyNoteGroupPageable;
  }) => {
    const {
      studyRoomId,
      teachingNoteGroupId,
      pageable: { page, size, sortKey },
    } = args;
    return queryOptions({
      queryKey: StudyNoteQueryKey.byGroupId(
        studyRoomId,
        teachingNoteGroupId,
        page,
        size,
        sortKey
      ),
      queryFn: () =>
        api.getNotesByGroup({
          studyRoomId,
          teachingNoteGroupId,
          pageable: { page, size, sortKey },
        }),
      ...opt,
    });
  };

  const detail = (teachingNoteId: number) =>
    queryOptions({
      queryKey: StudyNoteQueryKey.detail(teachingNoteId),
      queryFn: () => api.getDetail(teachingNoteId),
      ...opt,
    });

  return { list, byGroup, detail };
};
