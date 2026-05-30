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
    choicesText: z.string().min(1, '선지를 한 줄에 하나씩 입력해주세요.'),
    correctAnswer: z.string().min(1, '정답을 입력해주세요.'),
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

    const choices = value.choicesText
      .split('\n')
      .map((choice) => choice.trim())
      .filter(Boolean);

    if (!choices.includes(value.correctAnswer.trim())) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['correctAnswer'],
        message: '정답은 선지 중 하나와 정확히 일치해야 합니다.',
      });
    }
  });

export type AdminChallengeForm = z.infer<typeof AdminChallengeFormSchema>;
