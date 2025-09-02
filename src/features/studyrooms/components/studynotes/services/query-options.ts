import { Pageable, PaginationMeta } from '@/lib/api';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import type { StudyNoteGroup, StudyNoteGroupPageable } from '../type';
import {
  getStudyNoteDetail,
  getStudyNoteGroup,
  getStudyNotes,
  updateStudyNote,
} from './api';

export const StudyNotesQueryKey = {
  all: ['studyNotes'],
  studyNotes: (args: {
    studyRoomId: number;
    pageable: StudyNoteGroupPageable;
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
    teachingNoteGroupId: number;
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

export const getStudyNoteGroupInfiniteOption = (args: {
  studyRoomId: number;
  pageable: Pageable;
}) => {
  return infiniteQueryOptions({
    queryKey: [...StudyNoteGroupQueryKey.studyNoteGroups(args), 'infinite'],
    queryFn: ({ pageParam = 0 }) =>
      getStudyNoteGroup({
        ...args,
        pageable: { ...args.pageable, page: pageParam },
      }),
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: PaginationMeta & { content: StudyNoteGroup[] }
    ) => {
      if (lastPage.pageNumber >= lastPage.totalPages - 1) return undefined;
      return lastPage.pageNumber + 1;
    },
  });
};

export const getStudyNoteDetailsOption = (args: { teachingNoteId: number }) => {
  return queryOptions({
    queryKey: StudyNoteDetailsQueryKey.studyNoteDetails(args),
    queryFn: () => getStudyNoteDetail(args),
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
