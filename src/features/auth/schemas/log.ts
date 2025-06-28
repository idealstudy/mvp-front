import { z } from 'zod';

export const logSchema = z.object({
  title: z
    .string()
    .min(2, '제목은 2글자 이상 입력해야 합니다.')
    .max(40, '40글자 이상은 입력이 불가합니다.'),
  date: z.string().min(1, '날짜를 입력해 주세요'),
  students: z
    .array(z.string(), {
      required_error: '학생을 입력해 주세요',
    })
    .refine((arr) => arr.length > 0, {
      message: '최소 한 명 이상의 학생을 입력해 주세요',
    }),
  contents: z.string().min(1, '내용을 입력해 주세요'),
});

export type LogValues = z.infer<typeof logSchema>;
