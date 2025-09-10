import { getStudyNoteDetail } from '@/features/dashboard/studynote/detail/service/api';
import { Pageable } from '@/lib/api';
import { queryOptions } from '@tanstack/react-query';

import type { StudyNoteGroupPageable } from '../type';
import { getStudyNotes, getStudyNotesByGroupId, updateStudyNote } from './api';

export const StudyNotesQueryKey = {
  all: ['studyNotes'],
  studyNotes: (args: {
    studyRoomId: number;
    pageable: StudyNoteGroupPageable;
    // keyword: string;
  }) => [
    ...StudyNotesQueryKey.all,
    'studyNotes',
    args.studyRoomId,
    args.pageable,
    // args.keyword,
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

export const StudyNotesByGroupIdQueryKey = {
  all: ['studyNotesByGroupId'],
  studyNotesByGroupId: (args: {
    studyRoomId: number;
    teachingNoteGroupId: number;
    pageable: StudyNoteGroupPageable;
    // keyword: string;
  }) => [
    ...StudyNotesByGroupIdQueryKey.all,
    'studyNotesByGroupId',
    args.studyRoomId,
    args.teachingNoteGroupId,
    args.pageable,
    // args.keyword,
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

export const StudyNoteDetailsQueryKey = {
  all: ['studyNoteDetails'],
  studyNoteDetails: (args: { teachingNoteId: number }) => [
    ...StudyNoteDetailsQueryKey.all,
    'studyNoteDetails',
    args.teachingNoteId,
  ],
};

export const UpdateStudyNoteQueryKey = {
  all: ['updateStudyNote'],
  updateStudyNote: (args: {
    teachingNoteId: number;
    studyRoomId: number;
    teachingNoteGroupId: number | null;
    title: string;
    content: string;
    visibility: string;
    taughtAt: string;
    studentIds: number[];
  }) => [
    ...UpdateStudyNoteQueryKey.all,
    'updateStudyNote',
    args.teachingNoteId,
    args.studyRoomId,
    args.teachingNoteGroupId,
    args.title,
    args.content,
    args.visibility,
    args.taughtAt,
    args.studentIds,
  ],
};

export const getStudyNotesOption = (args: {
  studyRoomId: number;
  pageable: StudyNoteGroupPageable;
  // keyword: string;
}) => {
  return queryOptions({
    queryKey: StudyNotesQueryKey.studyNotes(args),
    queryFn: () => getStudyNotes(args),
  });
};

export const getStudyNotesByGroupIdOption = (args: {
  studyRoomId: number;
  teachingNoteGroupId: number;
  pageable: StudyNoteGroupPageable;
  // keyword: string;
}) => {
  return queryOptions({
    queryKey: StudyNotesByGroupIdQueryKey.studyNotesByGroupId(args),
    queryFn: () => getStudyNotesByGroupId(args),
  });
};

export const getStudyNoteDetailsOption = (args: { teachingNoteId: number }) => {
  return queryOptions({
    queryKey: StudyNoteDetailsQueryKey.studyNoteDetails(args),
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
    queryKey: UpdateStudyNoteQueryKey.updateStudyNote(args),
    queryFn: () => updateStudyNote(args),
  });
};
