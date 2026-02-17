import { dto } from '@/entities/student/infrastructure';
import { z } from 'zod';

export type StudentReportDTO = z.infer<typeof dto.studentReport>;
