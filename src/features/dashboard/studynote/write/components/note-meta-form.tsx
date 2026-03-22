import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { TextEditor } from '@/shared/components/editor';
import { Form } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';

import { StudyNoteForm } from '../schemas/note';
import {
  useConnectMembers,
  useWriteStudyNoteMutation,
} from '../services/query';
import { RequiredMark } from './form-provider';
import TagInput from './tag-input';

export const NoteMetaFields = () => {
  const {
    register,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext<StudyNoteForm>();

  const roomId = watch('studyRoomId');
  const { data: members } = useConnectMembers(roomId);
  const { isPending } = useWriteStudyNoteMutation();

  useEffect(() => {
    const tempTitle = sessionStorage.getItem('study-note-title');
    if (tempTitle) {
      setValue('title', tempTitle);
      sessionStorage.removeItem('study-note-title');
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
            placeholder="수업 노트의 제목을 입력해주세요."
            disabled={isPending}
          />
        </Form.Control>
        <Form.ErrorMessage className="text-system-warning text-sm">
          {errors.title?.message}
        </Form.ErrorMessage>
      </Form.Item>

      {/* 수업 대상 */}
      <Form.Item error={!!errors.studentIds}>
        <Form.Label>수업 대상</Form.Label>
        <Form.Control>
          <Controller
            name="studentIds"
            control={control}
            render={({ field, formState: { errors } }) => {
              return (
                <TagInput
                  students={members || []}
                  selected={field.value}
                  onChange={field.onChange}
                  error={!!errors.studentIds}
                  placeholder={'이 수업을 들은 학생을 선택해 주세요.'}
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

      {/* 수업 날짜 */}
      <Form.Item error={!!errors.taughtAt}>
        <Form.Label>
          수업 날짜
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <Input
            {...register('taughtAt')}
            type="date"
            disabled={isPending}
          />
        </Form.Control>
        {errors.taughtAt && (
          <Form.ErrorMessage className="text-system-warning text-sm">
            {errors.taughtAt.message}
          </Form.ErrorMessage>
        )}
      </Form.Item>

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
