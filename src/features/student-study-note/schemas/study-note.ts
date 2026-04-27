import { JSONContent } from '@tiptap/react';
import { z } from 'zod';

export const studentStudyNoteSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해 주세요.')
    .max(50, '제목은 50자 이하로 입력해주세요.'),
  studiedAt: z.string().min(1, '학습 날짜를 선택해 주세요.'),
  subject: z.string().min(1, '과목을 선택해 주세요.'),
  content: z.custom<JSONContent>(),
});

export type StudentStudyNoteForm = z.infer<typeof studentStudyNoteSchema>;
