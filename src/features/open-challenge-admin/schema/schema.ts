import {
  type AdminChallengeDifficulty,
  type AdminChallengeSubject,
} from '@/entities/open-challenge';
import { z } from 'zod';

export const AdminChallengeFormSchema = z
  .object({
    subject: z.custom<AdminChallengeSubject>(),
    difficulty: z.custom<AdminChallengeDifficulty>(),
    wrongAnswerRate: z.coerce
      .number()
      .min(0, '0 이상으로 입력해주세요.')
      .max(100, '100 이하로 입력해주세요.'),
    title: z.string().min(1, '관리용 제목을 입력해주세요.'),
    sourceText: z.string().min(1, '출처를 입력해주세요.'),
    questionText: z.string(),
    questionMediaId: z.string(),
    choices: z
      .array(
        z.object({
          value: z.string().min(1, '선지를 입력해주세요.'),
        })
      )
      .min(1, '선지는 최소 1개 필요합니다.')
      .max(5, '선지는 최대 5개까지 등록할 수 있습니다.'),
    correctChoiceIndex: z.number().int().min(0, '정답을 선택해주세요.'),
    type: z.string(),
  })
  .superRefine((value, context) => {
    if (!value.questionText.trim() && !value.questionMediaId.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['questionText'],
        message: '문제 본문 또는 이미지 mediaId 중 하나는 필요합니다.',
      });
    }

    const choices = value.choices
      .map((choice) => choice.value.trim())
      .filter(Boolean);

    if (!choices[value.correctChoiceIndex]) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['correctChoiceIndex'],
        message: '정답 선지를 선택해주세요.',
      });
    }
  });

export type AdminChallengeForm = z.infer<typeof AdminChallengeFormSchema>;
