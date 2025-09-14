import { getStudyNoteDetail } from '@/features/dashboard/studynote/detail/service/api';
import { queryOptions } from '@tanstack/react-query';

import type { StudyNoteGroupPageable } from '../../studyrooms/components/studynotes/type';
import { getStudyNotes, getStudyNotesByGroupId, updateStudyNote } from './api';

export const StudyNoteQueryKey = {
  all: ['studynote'],
  byGroupId: ['studynote', 'byGroupId'],
  byId: ['studynote', 'byId'],
  update: ['studynote', 'update'],
};

export const getStudyNotesOption = (args: {
  studyRoomId: number;
  pageable: StudyNoteGroupPageable;
  // keyword: string;
}) => {
  return queryOptions({
    queryKey: [StudyNoteQueryKey.all, args],
    queryFn: () => getStudyNotes(args),
  });
};

export const getStudyNotesByGroupIdOption = (args: {
  studyRoomId: number;
  teachingNoteGroupId: number;
  pageable: StudyNoteGroupPageable;
}) => {
  return queryOptions({
    queryKey: [StudyNoteQueryKey.byGroupId, args],
    queryFn: () => getStudyNotesByGroupId(args),
  });
};

export const getStudyNoteDetailsOption = (args: { teachingNoteId: number }) => {
  return queryOptions({
    queryKey: [StudyNoteQueryKey.byId, args],
    queryFn: () => getStudyNoteDetail(args.teachingNoteId),
  });
};

export const getUpdateStudyNoteOption = (args: {
  teachingNoteId: number;
  studyRoomId: number;
  teachingNoteGroupId: number;
  title: string;
  content: string;
  visibility: string;
  taughtAt: string;
  studentIds: number[];
}) => {
  return queryOptions({
    queryKey: [StudyNoteQueryKey.update, args],
    queryFn: () => updateStudyNote(args),
  });
};
