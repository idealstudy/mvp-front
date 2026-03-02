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

export const CareerFormSchema = z
  .object({
    name: z.string().min(1, '경력명을 입력해주세요'),
    description: z.string().optional(),
    startDate: z.string().min(1, '시작일을 선택해주세요'),
    endDate: z.string(),
    isCurrent: z.boolean(),
  })
  .refine(
    (data) => {
      // 진행 중이 아니면 종료일 필수
      if (!data.isCurrent && !data.endDate) {
        return false;
      }
      return true;
    },
    { message: '종료일을 선택해주세요', path: ['endDate'] }
  );

export type CareerForm = z.infer<typeof CareerFormSchema>;
