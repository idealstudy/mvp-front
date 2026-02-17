import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';

import { dto } from './student.dto';

/* ─────────────────────────────────────────────────────
 * 학생 통계 조회
 * ────────────────────────────────────────────────────*/
const getStudentReport = async () => {
  const response = await api.private.get(`/student/me/report`);
  return unwrapEnvelope(response, dto.studentReport);
};

export const studentRepository = {
  getStudentReport,
};
