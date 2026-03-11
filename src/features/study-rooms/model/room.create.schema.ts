import { toPlainText } from '@/shared/lib';
import { JSONContent } from '@tiptap/react';
import { z } from 'zod';

export const CreateStudyRoomSchema = z.object({
  name: z.string().min(1, '스터디룸 이름을 입력해주세요.'),
  description: z.string().min(1, '스터디룸 간단 소개를 입력해주세요.').max(200),
  characteristic: z
    .custom<JSONContent>((val) => typeof val === 'object' && val !== null)
    .refine((val) => toPlainText(val).length <= 200, {
      message: '스터디룸 특징은 200자 이하로 입력해주세요.',
    }),
  visibility: z.enum(['PUBLIC', 'PRIVATE'], {
    required_error: '공개 범위를 선택해주세요.',
  }),
  modality: z.enum(['ONLINE', 'OFFLINE'], {
    required_error: '수업 장소를 선택해주세요.',
  }),
  classForm: z.enum(['ONE_ON_ONE', 'ONE_TO_MANY'], {
    required_error: '수업 대상을 선택해주세요.',
  }),
  subjectType: z.enum(['KOREAN', 'ENGLISH', 'MATH', 'OTHER'], {
    required_error: '과목을 선택해주세요.',
  }),
  schoolInfo: z
    .object({
      schoolLevel: z.enum(['HIGH', 'MIDDLE', 'ELEMENTARY', 'OTHER'], {
        required_error: '학교를 선택해주세요.',
      }),
      grade: z.coerce.number().int().optional(),
    })
    .refine(
      ({ schoolLevel, grade }) => {
        if (schoolLevel === 'OTHER') return grade == null;
        if (grade == null) return false;
        if (schoolLevel === 'ELEMENTARY') return grade >= 1 && grade <= 6;
        return grade >= 1 && grade <= 3;
      },
      { message: '학년 범위가 올바르지 않습니다.', path: ['grade'] }
    ),
});

export type StudyRoomFormValues = z.infer<typeof CreateStudyRoomSchema>;

export type StudyRoomSubmitValues = Omit<
  StudyRoomFormValues,
  'characteristic'
> & {
  characteristic: string;
};
