import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  useConnectMembers,
  useWriteStudyNoteMutation,
} from '@/features/dashboard/studynote/write/services/query';
import { useGetTeacherNotesList } from '@/features/study-notes/hooks';
import { StudyNoteGroupPageable } from '@/features/study-notes/model';
import { TextEditor } from '@/shared/components/editor';
import { RequiredMark } from '@/shared/components/ui';
import { Form } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';

import { HomeworkForm } from '../schemas/note';
import TagInput from './tag-input';
import TagInputNote from './tag-input-note';

export const HomeworkMetaFields = () => {
  const {
    register,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext<HomeworkForm>();

  const NOTE_PAGEABLE: StudyNoteGroupPageable = {
    page: 0,
    size: 20,
    sortKey: 'LATEST_EDITED',
  };

  const roomId = watch('studyRoomId');

  const { data: notes } = useGetTeacherNotesList({
    studyRoomId: roomId,
    pageable: NOTE_PAGEABLE,
    enabled: !!roomId,
  });

  const { data: members } = useConnectMembers(roomId);
  const { isPending } = useWriteStudyNoteMutation();

  type ReminderOption = {
    label: string;
    value: 'HOUR_1' | 'HOUR_3' | 'DAY_1';
  };

  const REMINDER_OPTIONS: ReminderOption[] = [
    { label: '1시간 전', value: 'HOUR_1' },
    { label: '3시간 전', value: 'HOUR_3' },
    { label: '1일 전', value: 'DAY_1' },
  ];

  useEffect(() => {
    const tempTitle = sessionStorage.getItem('study-homework-title');
    if (tempTitle) {
      setValue('title', tempTitle);
      sessionStorage.removeItem('study-homework-title');
    }
  }, [setValue]);
  return (
    <>
      {/* 제목 */}
      <Form.Item error={!!errors.title}>
        <Form.Label>
          제목
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <Input
            {...register('title')}
            type="text"
            placeholder="과제의 제목을 입력해주세요."
            disabled={isPending}
          />
        </Form.Control>
        <Form.ErrorMessage className="text-system-warning text-sm">
          {errors.title?.message}
        </Form.ErrorMessage>
      </Form.Item>

      {/* 수업노트 연결 */}
      <Form.Item error={!!errors.teachingNoteIds}>
        <Form.Label>수업노트 연결</Form.Label>
        <Form.Control>
          <Controller
            name="teachingNoteIds"
            control={control}
            render={({ field }) => (
              <TagInputNote
                studyNotes={notes?.content ?? []}
                selectedIds={field.value ?? []}
                onChange={field.onChange}
                placeholder="과제와 연관된 수업노트를 연결해주세요."
                error={!!errors.teachingNoteIds}
                disabled={isPending}
              />
            )}
          />
        </Form.Control>

        {errors.teachingNoteIds && (
          <Form.ErrorMessage className="text-system-warning text-sm">
            {errors.teachingNoteIds.message}
          </Form.ErrorMessage>
        )}
      </Form.Item>

      {/* 제출 대상 */}
      <Form.Item error={!!errors.studentIds}>
        <Form.Label>제출 대상</Form.Label>

        <Form.Control>
          <Controller
            name="studentIds"
            control={control}
            render={({ field, formState: { errors } }) => {
              return (
                <TagInput
                  students={members || []}
                  selected={field.value || []}
                  onChange={field.onChange}
                  error={!!errors.studentIds}
                  placeholder="이 과제를 제출할 학생을 선택해주세요."
                  disabled={isPending}
                />
              );
            }}
          />
        </Form.Control>
        {errors.studentIds && (
          <Form.ErrorMessage className="text-system-warning text-sm">
            {errors.studentIds.message}
          </Form.ErrorMessage>
        )}
      </Form.Item>

      {/* 마감 기한 + 리마인드 알림 */}
      <Form.Row
        columns={2}
        className="max-desktop:grid-cols-1"
      >
        <Form.Item error={!!errors.deadline}>
          <Form.Label>
            마감 기한
            <RequiredMark />
          </Form.Label>
          <Form.Control>
            <Input
              {...register('deadline')}
              type="datetime-local"
              disabled={isPending}
            />
          </Form.Control>
          <Form.ErrorMessage>{errors.deadline?.message}</Form.ErrorMessage>
        </Form.Item>

        <Form.Item error={!!errors.reminderOffsets}>
          <Form.Label>리마인드 알림</Form.Label>

          <Form.Control>
            <div className="border-gray-scale-gray-30 flex h-[56px] items-center gap-4 rounded-[4px] border px-[24px]">
              {REMINDER_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    value={opt.value}
                    {...register('reminderOffsets')}
                    disabled={isPending}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </Form.Control>
        </Form.Item>
      </Form.Row>

      {/* 내용 */}
      <Form.Item error={!!errors.content}>
        <Form.Label>
          내용
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <Controller
            name="content"
            control={control}
            render={({ field }) => {
              return (
                <TextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="수업 내용을 입력해주세요..."
                  targetType="HOMEWORK"
                />
              );
            }}
          />
        </Form.Control>
        {errors.content && (
          <Form.ErrorMessage className="text-system-warning text-sm">
            {typeof errors.content?.message === 'string'
              ? errors.content.message
              : null}
          </Form.ErrorMessage>
        )}
      </Form.Item>
    </>
  );
};
