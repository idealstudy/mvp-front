import { useQuery } from '@tanstack/react-query';

import { getStudyNoteDetailOption } from './query-options';

export const useStudyNoteDetailQuery = (id: number) => {
  return useQuery(getStudyNoteDetailOption(id));
};
