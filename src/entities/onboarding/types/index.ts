import { z } from 'zod';

import { dto } from '../infrastructure';

export const TeacherOnboardingStepTypes = dto.teacherStepType._def.values;

export type TeacherOnboardingDTO = z.infer<typeof dto.teacher>;
export type TeacherOnboardingStepType = z.infer<typeof dto.teacherStepType>;
export type TeacherOnboardingStep = z.infer<typeof dto.teacherOnboardingStep>;
