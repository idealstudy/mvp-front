import { domain } from '@/entities/teacher/core/teacher.domain';
import { dto, payload } from '@/entities/teacher/infrastructure/teacher.dto';
import { z } from 'zod';

export type TeacherBasicInfoDTO = z.infer<typeof dto.basicInfo>;

export type FrontendTeacherBasicInfo = z.infer<typeof domain.basicInfo>;

export type UpdateTeacherBasicInfoPayload = z.infer<
  typeof payload.updateBasicInfo
>;
