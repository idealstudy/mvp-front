'use client';

import { Controller, useForm } from 'react-hook-form';

import { ConsultationDetail } from '@/entities/consultation';
import { useCreateConsultationAnswer } from '@/features/consultation/hooks/use-answer-form';
import { useTeacherProfile } from '@/features/consultation/hooks/use-teacher-profile';
import {
  ConsultationAnswerForm,
  ConsultationAnswerFormSchema,
} from '@/features/consultation/schema/schema';
import {
  TextEditor,
  initialTextEditorValue,
  prepareContentForSave,
} from '@/shared/components/editor';
import { Button, Form } from '@/shared/components/ui';
import { cn, extractText } from '@/shared/lib';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ConsultationAnswerWrite({
  consultation,
}: {
  consultation: ConsultationDetail;
}) {
  const { data: teacherProfile } = useTeacherProfile(
    consultation.targetTeacherId
  );

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
  } = useForm<ConsultationAnswerForm>({
    resolver: zodResolver(ConsultationAnswerFormSchema),
    defaultValues: { content: initialTextEditorValue },
    mode: 'onChange',
  });

  const { mutate, isPending } = useCreateConsultationAnswer(consultation.id);

  const onSubmit = (data: ConsultationAnswerForm) => {
    const { contentString, mediaIds } = prepareContentForSave(data.content);
    mutate({ content: contentString, mediaIds });
  };

  return (
    <div className="border-line-line1 mt-4 h-fit w-full rounded-xl border bg-white px-8 py-10">
      <div className="flex flex-col gap-5">
        {/* 프로필 */}
        <div className="flex flex-row items-center gap-3">
          <div className="bg-gray-scale-gray-10 h-10 w-10 rounded-full" />
          <span className="font-body2-heading">
            {teacherProfile?.name ? `${teacherProfile.name} 선생님` : null}
          </span>
        </div>

        {/* 답변 작성 폼 */}
        <Form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Controller
            name="content"
            control={control}
            render={({ field }) => {
              const text = extractText(JSON.stringify(field.value));
              const length = text.length;
              return (
                <>
                  <TextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="답변을 입력해주세요."
                    minHeight="400px"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-system-warning text-sm">
                      {typeof errors.content?.message === 'string' &&
                        errors.content.message}
                    </p>
                    <span
                      className={cn(
                        length > 3000 ? 'text-system-warning' : 'text-gray-5'
                      )}
                    >
                      {length} / 3000
                    </span>
                  </div>
                </>
              );
            }}
          />
          <Button
            type="submit"
            disabled={isPending || !isDirty || !isValid}
            className="w-full"
          >
            {isPending ? '저장 중' : '답변 등록'}
          </Button>
        </Form>
      </div>
    </div>
  );
}
