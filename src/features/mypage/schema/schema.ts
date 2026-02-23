import { z } from 'zod';

export const BasicInfoFormSchema = z.object({
  name: z.string().trim().min(1, '이름을 입력해주세요.').max(30),
  isProfilePublic: z.boolean(),
  simpleIntroduction: z
    .string()
    .trim()
    .max(300, '소개는 300자 이내로 작성해주세요.')
    .optional(),
  learningGoal: z
    .string()
    .trim()
    .max(300, '목표는 300자 이내로 작성해주세요.')
    .optional(),
});

export type BasicInfoForm = z.infer<typeof BasicInfoFormSchema>;
