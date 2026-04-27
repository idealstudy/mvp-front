import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';

import type { Subject } from '../types';
import { subjectDto } from './subject.dto';

const getSubjectList = async (): Promise<Subject[]> => {
  const response = await api.public.get('/public/subject-list');
  return unwrapEnvelope(response, subjectDto.list);
};

export const subjectRepository = {
  getList: getSubjectList,
};
