import { z } from 'zod';

// Step Type
const TeacherOnboardingStepTypeSchema = z.enum([
  'CREATE_STUDY_ROOM',
  'INVITE_STUDENT',
  'CREATE_CLASS_NOTE',
  'ASSIGN_ASSIGNMENT',
  'GIVE_FEEDBACK',
]);

// Step (completedSteps 용도)
const OnboardingStepSchema = z.object({
  stepName: TeacherOnboardingStepTypeSchema,
  description: z.string(),
  order: z.number(),
});

/* ─────────────────────────────────────────────────────
 * api 응답(DTO 객체)
 * ────────────────────────────────────────────────────*/
const TeacherOnboardingDtoSchema = z.object({
  completedSteps: z.array(OnboardingStepSchema),
  nextStep: TeacherOnboardingStepTypeSchema.nullable(),
  totalSteps: z.number(),
  currentProgress: z.number(),
});

export const dto = {
  teacher: TeacherOnboardingDtoSchema,
  teacherStepType: TeacherOnboardingStepTypeSchema,
  teacherOnboardingStep: OnboardingStepSchema,
};
