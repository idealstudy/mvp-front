import { domain } from '@/entities/student/core/student.domain';
import { dto, payload } from '@/entities/student/infrastructure/student.dto';
import { z } from 'zod';

export type StudentBasicInfoDTO = z.infer<typeof dto.basicInfo>;

export type FrontendStudentBasicInfo = z.infer<typeof domain.basicInfo>;

export type UpdateStudentBasicInfoPayload = z.infer<
  typeof payload.updateBasicInfo
>;
