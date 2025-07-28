'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TextEditor } from '@/features/editor/components/text-editor';

import { StudyNoteForm } from '../schemas/note';
import {
  useConnectMembers,
  useWriteStudyNoteMutation,
} from '../services/query';
import { RequiredMark } from './form-provider';
import TagInput from './tag-input';

const MetaSection = () => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<StudyNoteForm>();

  const roomId = watch('studyRoomId');
  const { data } = useConnectMembers(roomId);

  const { isPending } = useWriteStudyNoteMutation();

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
        <Form.Label>
          수업 대상
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <Controller
            name="studentIds"
            control={control}
            rules={{ required: '수업 대상 학생을 선택해주세요.' }}
            render={({ field, formState: { errors } }) => {
              return (
                <TagInput
                  students={data?.members || []}
                  selected={field.value}
                  onChange={field.onChange}
                  error={!!errors.studentIds}
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
                  value={field}
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

export default MetaSection;
