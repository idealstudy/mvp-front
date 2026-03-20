import { z } from 'zod';

import { dto } from '../infrastructure/homework.dto';

type HomeworkSubmitStatus = z.infer<typeof dto.enums.submitStatus>;

export const HOMEWORK_SUBMIT_STATUS_LABEL: Record<
  HomeworkSubmitStatus,
  string
> = {
  SUBMIT: '제출 완료',
  NOT_SUBMIT: '미제출',
  LATE_SUBMIT: '지연 제출',
};
