'use client';

import { Controller, useForm } from 'react-hook-form';

import { useCreateConsultation } from '@/features/consultation/hooks/use-consultation-form';
import { useTeacherProfile } from '@/features/consultation/hooks/use-teacher-profile';
import { useTeacherStudyRooms } from '@/features/consultation/hooks/use-teacher-study-rooms';
import {
  ConsultationForm,
  ConsultationFormSchema,
} from '@/features/consultation/schema/schema';
import {
  Button,
  Form,
  Input,
  RequiredMark,
  Select,
  Textarea,
} from '@/shared/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ConsultationWriteArea({
  teacherId,
  studyRoomId,
  isEditMode,
}: {
  teacherId: number;
  studyRoomId?: number;
  isEditMode?: boolean;
}) {
  const createConsultationMutation = useCreateConsultation();

  // TODO update 추가
  const mutation = isEditMode
    ? createConsultationMutation
    : createConsultationMutation;

  // 스터디룸 목록
  const { data: studyRooms } = useTeacherStudyRooms(teacherId);

  // 선생님 정보
  const { data: teacherProfile } = useTeacherProfile(teacherId);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
  } = useForm<ConsultationForm>({
    resolver: zodResolver(ConsultationFormSchema),
    defaultValues: {
      teacherId,
      studyRoomId,
      title: '',
      content: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: ConsultationForm) => {
    mutation.mutate({
      targetTeacherId: data.teacherId,
      studyRoomId: data.studyRoomId,
      title: data.title,
      content: data.content,
    });
  };

  return (
    <>
      <h1 className="font-title-heading mb-10">어떤 내용을 문의하시겠어요?</h1>

      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* 제목 */}
        <Form.Item error={!!errors.title}>
          <Form.Label className="font-body1-heading mb-2">
            문의 제목 <RequiredMark />
          </Form.Label>
          <Form.Control>
            <Input
              {...register('title')}
              placeholder="문의 제목을 입력해주세요."
              disabled={mutation.isPending}
            />
          </Form.Control>
          <Form.ErrorMessage className="text-sm">
            {errors.title?.message}
          </Form.ErrorMessage>
        </Form.Item>

        {/* 스터디룸 */}
        {studyRooms && studyRooms.length > 0 && (
          <Form.Item>
            <Form.Label className="font-body1-heading mb-2">
              스터디룸
            </Form.Label>
            <Form.Control>
              <Controller
                name="studyRoomId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() ?? ''}
                    onValueChange={(v) =>
                      field.onChange(v ? Number(v) : undefined)
                    }
                    disabled={mutation.isPending}
                  >
                    <Select.Trigger
                      placeholder="스터디룸을 선택해주세요."
                      className="border-line-line2"
                    />
                    <Select.Content className="border-line-line2 max-h-40 overflow-y-auto">
                      {studyRooms.map((room) => (
                        <Select.Option
                          key={room.id}
                          value={room.id.toString()}
                        >
                          {room.name}
                        </Select.Option>
                      ))}
                    </Select.Content>
                  </Select>
                )}
              />
            </Form.Control>
          </Form.Item>
        )}

        {/* 선생님 (문의 대상) */}
        <Form.Item>
          <Form.Label className="font-body1-heading mb-2">
            문의 대상 <RequiredMark />
          </Form.Label>
          <Input
            value={teacherProfile?.name ? `${teacherProfile?.name} 선생님` : ''}
            readOnly
            disabled
          />
        </Form.Item>

        {/* 내용 */}
        <Form.Item error={!!errors.content}>
          <Form.Label className="font-body1-heading">
            문의 내용 <RequiredMark />
          </Form.Label>
          <Form.Control>
            <Textarea
              {...register('content')}
              placeholder="문의 내용을 입력해주세요."
              disabled={mutation.isPending}
            />
          </Form.Control>
          <Form.ErrorMessage className="text-sm">
            {errors.content?.message}
          </Form.ErrorMessage>
        </Form.Item>

        {/* 제출 버튼 */}
        <Button
          type="submit"
          disabled={mutation.isPending || !isDirty || !isValid}
          className="w-full"
        >
          {mutation.isPending ? '저장 중' : '문의 남기기'}
        </Button>
      </Form>
    </>
  );
}
