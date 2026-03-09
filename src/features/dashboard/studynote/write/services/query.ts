import { StudyNoteQueryKey } from '@/entities/study-note';
import { teacherKeys } from '@/entities/teacher';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { StudyNote } from '../type';
import { createStudyNoteGroup, writeStudyNote } from './api';
import {
  StudyNoteWriteQueryKey,
  getConnectMembersOption,
  getStudyNoteGroupsOption,
  getStudyRoomsOption,
} from './query-options';

export const useConnectMembers = (roomId: number) => {
  return useQuery(getConnectMembersOption(roomId));
};

export const useStudyNoteGroupsQuery = (roomId: number) => {
  return useQuery(getStudyNoteGroupsOption(roomId));
};

export const useWriteStudyNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StudyNote) => writeStudyNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: StudyNoteQueryKey.all });
      queryClient.invalidateQueries({ queryKey: teacherKeys.dashboard.all() });
    },
  });
};

export const useCreateNoteGroupMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createStudyNoteGroup,
    onSuccess: async (_created, { studyRoomId }) => {
      const key = StudyNoteWriteQueryKey.studyNoteGroups(studyRoomId);

      // stale 처리 + 활성 쿼리 즉시 재요청
      await qc.invalidateQueries({ queryKey: key, refetchType: 'active' });
      await qc.fetchQuery(getStudyNoteGroupsOption(studyRoomId));
    },
  });
};

// export const useStudyNoteListByStudyRoomQuery = ({
//   roomId,
//   pageble,
// }: {
//   roomId: number;
//   pageble: Pageable;
// }) => {
//   return useQuery(getStudyNoteListByStudyRoomOption({ roomId, pageble }));
// };

// 임시로 작성된 스터디 룸 Query
export const useStudyRoomsQuery = () => {
  return useQuery(getStudyRoomsOption());
};
