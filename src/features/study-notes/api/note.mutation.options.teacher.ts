import { StudyNoteQueryKey } from '@/entities/study-note';
import { StudyNoteGroupPageable } from '@/features/study-notes/model';
import { BaseQueryOptions } from '@/shared/lib/query/types';
import { QueryKey } from '@tanstack/query-core';

import type { TeacherNotesApi } from './note.api.teacher';

export type PageableArgs = {
  page: number;
  size: number;
  sortKey: string;
};

export type UpdateArgs = {
  teachingNoteId: number;
  studyRoomId: number;
  teachingNoteGroupId: number | null;
  title: string;
  content: string;
  visibility: string;
  taughtAt: string;
  studentIds: number[];
};
export type UpdateMutationVar = UpdateArgs & {
  pageable: StudyNoteGroupPageable;
};

export type MoveArgs = {
  studyNoteId: number;
  groupId: number | null;
  studyRoomId: number;
};
export type MoveMutationVar = MoveArgs & {
  pageable: StudyNoteGroupPageable;
};

export type RemoveArgs = { studyNoteId: number };
export type RemoveMutationVar = RemoveArgs & {
  studyRoomId: number;
  groupId?: number | null;
  pageable: StudyNoteGroupPageable;
};

export type DeleteArgs = {
  studyNoteId: number;
  studyRoomId: number;
};

export type DeleteMutationVar = DeleteArgs & {
  pageable: StudyNoteGroupPageable;
  groupId?: number | null;
};

export const createTeacherNoteMutationOptions = (
  api: TeacherNotesApi,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _base?: BaseQueryOptions
) => {
  const update = () => ({
    mutationFn: (args: UpdateMutationVar) => api.update(args),
    onSuccess: (_data: unknown, vars: UpdateMutationVar) => ({
      invalidate: [
        { key: StudyNoteQueryKey.listPrefix(vars.studyRoomId) },
        {
          key: StudyNoteQueryKey.list(
            vars.studyRoomId,
            vars.pageable.page,
            vars.pageable.size,
            vars.pageable.sortKey
          ),
        },
        {
          key: StudyNoteQueryKey.byGroupPrefix(
            vars.studyRoomId,
            vars.teachingNoteGroupId ?? -1
          ),
        },
        { key: StudyNoteQueryKey.detail(vars.teachingNoteId) },
      ],
    }),
  });

  const moveToGroup = () => ({
    mutationFn: (args: MoveMutationVar) => api.moveToGroup(args),
    onSuccess: (_: unknown, vars: MoveMutationVar) => {
      const { studyRoomId, groupId, pageable } = vars;
      const invalidateKeys: { key: QueryKey }[] = [
        { key: StudyNoteQueryKey.listPrefix(vars.studyRoomId) },
        {
          key: StudyNoteQueryKey.list(
            studyRoomId,
            pageable.page,
            pageable.size,
            pageable.sortKey
          ),
        },
      ];

      if (groupId != null) {
        invalidateKeys.push({
          key: StudyNoteQueryKey.byGroupPrefix(studyRoomId, groupId),
        });
      }

      return { invalidate: invalidateKeys };
    },
  });

  const removeFromGroup = () => ({
    mutationFn: (args: RemoveMutationVar) => api.removeFromGroup(args),
    onSuccess: (_: unknown, vars: RemoveMutationVar) => {
      const { studyRoomId, groupId, pageable } = vars;
      const invalidateKeys: { key: QueryKey }[] = [
        { key: StudyNoteQueryKey.listPrefix(studyRoomId) },
        {
          key: StudyNoteQueryKey.list(
            studyRoomId,
            pageable.page,
            pageable.size,
            pageable.sortKey
          ),
        },
      ];

      if (groupId != null) {
        invalidateKeys.push({
          key: StudyNoteQueryKey.byGroupId(
            studyRoomId,
            groupId,
            pageable.page,
            pageable.size,
            pageable.sortKey
          ),
        });
      }

      return { invalidate: invalidateKeys };
    },
  });

  const refetchMembers = () => ({
    // 멤버 변경 작업이 따로 있다면 여기에 추가
    onSuccess: (_: unknown, vars: { studyRoomId: number }) => ({
      invalidate: [
        { key: StudyNoteQueryKey.membersPrefix('teacher', vars.studyRoomId) },
      ],
    }),
  });

  const removeStudyNote = () => ({
    mutationFn: (args: DeleteMutationVar) =>
      api.removeStudyNote({ studyNoteId: args.studyNoteId }),

    onSuccess: (_: unknown, vars: DeleteMutationVar) => {
      const invalidateKeys: Array<{ key: QueryKey }> = [
        { key: StudyNoteQueryKey.listPrefix(vars.studyRoomId) },
        {
          key: StudyNoteQueryKey.list(
            vars.studyRoomId,
            vars.pageable.page,
            vars.pageable.size,
            vars.pageable.sortKey
          ),
        },
      ];

      if (vars.groupId != null) {
        invalidateKeys.push({
          key: StudyNoteQueryKey.byGroupPrefix(vars.studyRoomId, vars.groupId),
        });
      }

      return {
        invalidate: invalidateKeys,
        remove: [{ key: StudyNoteQueryKey.detail(vars.studyNoteId) }],
      };
    },
  });

  return {
    update,
    moveToGroup,
    removeFromGroup,
    refetchMembers,
    removeStudyNote,
  };
};
