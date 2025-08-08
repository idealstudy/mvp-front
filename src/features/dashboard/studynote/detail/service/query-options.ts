import { queryOptions } from '@tanstack/react-query';

import { getStudyNoteDetail } from './api';

export const StudyNoteDetailQueryKey = {
  all: ['studyNoteDetail'],

  studyNoteDetail: (id: number) => [
    ...StudyNoteDetailQueryKey.all,
    'studyNoteDetail',
    id,
  ],
};

export const getStudyNoteDetailOption = (id: number) => {
  return queryOptions({
    queryKey: StudyNoteDetailQueryKey.studyNoteDetail(id),
    queryFn: () => getStudyNoteDetail(id),
  });
};
