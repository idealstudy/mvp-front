import { Pageable } from '@/lib/api';
import { queryOptions } from '@tanstack/react-query';

import { getStudyNoteGroup, getStudyNotes, updateStudyNoteGroup } from './api';

export const StudyNotesQueryKey = {
  all: ['studyNotes'],
  studyNotes: (args: {
    studyRoomId: number;
    pageable: { page: number; size: number; sortKey: string };
    keyword: string;
  }) => [
    ...StudyNotesQueryKey.all,
    'studyNotes',
    args.studyRoomId,
    args.pageable,
    args.keyword,
  ],
};

export const StudyNoteGroupQueryKey = {
  all: ['studyNoteGroups'],
  studyNoteGroups: (args: { studyRoomId: number; pageable: Pageable }) => [
    ...StudyNoteGroupQueryKey.all,
    'studyNoteGroups',
    args.studyRoomId,
    args.pageable,
  ],
};

export const UpdateStudyNoteGroupQueryKey = {
  all: ['updateStudyNoteGroup'],
  updateStudyNoteGroup: (args: {
    teachingNoteId: number;
    teachingNoteGroupId: number;
  }) => [
    ...UpdateStudyNoteGroupQueryKey.all,
    'updateStudyNoteGroup',
    args.teachingNoteId,
    args.teachingNoteGroupId,
  ],
};

export const getStudyNotesOption = (args: {
  studyRoomId: number;
  pageable: { page: number; size: number; sortKey: string };
  keyword: string;
}) => {
  return queryOptions({
    queryKey: StudyNotesQueryKey.studyNotes(args),
    queryFn: () => getStudyNotes(args),
  });
};

export const getStudyNoteGroupOption = (args: {
  studyRoomId: number;
  pageable: Pageable;
}) => {
  return queryOptions({
    queryKey: StudyNoteGroupQueryKey.studyNoteGroups(args),
    queryFn: () => getStudyNoteGroup(args),
  });
};

export const postStudyNoteGroupOption = (args: {
  teachingNoteId: number;
  teachingNoteGroupId: number;
}) => {
  return queryOptions({
    queryKey: UpdateStudyNoteGroupQueryKey.updateStudyNoteGroup(args),
    queryFn: () => updateStudyNoteGroup(args),
  });
};

// export const moveStudyNoteToGroupOption = (args: {
//   studyNoteId: number;
//   groupId: number | null;
//   studyRoomId: number;
// }) => {
//   return queryOptions({
//     queryKey: [
//       'moveStudyNoteToGroup',
//       args.studyNoteId,
//       args.groupId,
//       args.studyRoomId,
//     ],
//     queryFn: () => moveStudyNoteToGroup(args),
//   });
// };
