import { CourseTargetStudentInfo } from '@/features/dashboard/studynote/write/type';
import {
  extractTextFromTiptapJSON,
  hasNonTextContent,
} from '@/features/homework/hooks/use-homework-form-control';
import { JSONContent } from '@tiptap/react';
import { z } from 'zod';

// 마감일 컨트롤

const deadlineSchema = z
  .string()
  .min(1, '날짜를 선택해 주세요.')
  .refine((value) => {
    const now = new Date();
    const deadlineDate = new Date(value);

    return deadlineDate >= now;
  }, '마감일은 현재 시점 이후여야 합니다.');

export const contentSchema = z
  .custom<JSONContent>((val) => typeof val === 'object' && val !== null)
  .superRefine((val, ctx) => {
    const plainText = extractTextFromTiptapJSON(val);
    const length = plainText.trim().length;
    const hasAttachment = hasNonTextContent(val);

    if (length < 1 && !hasAttachment) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '내용 또는 첨부 파일을 입력해 주세요.',
      });
    }

    if (length > 3000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '3000자 이상은 입력하실 수 없습니다.',
      });
    }
  });

export const HomeworkFormSchema = z.object({
  title: z
    .string()
    .min(1, '과제 제목을 입력해 주세요.')
    .max(30, '과제 제목은 30자 이하로 입력해주세요.'),
  content: contentSchema,
  deadline: deadlineSchema,
  studentIds: z
    .array(z.custom<CourseTargetStudentInfo>())
    .min(1, '제출 대상을 최소 1명 이상 선택해 주세요.'),
  reminderOffsets: z
    .array(z.enum(['HOUR_1', 'HOUR_3', 'DAY_1']))
    .nullable()
    .optional(),
  teachingNoteIds: z.array(z.number()).optional(),
  studyRoomId: z.number(),
});

export type HomeworkForm = z.infer<typeof HomeworkFormSchema>;
