'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { TextEditor } from '@/shared/components/editor';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Select } from '@/shared/components/ui/select';
import { useSubjectList } from '@/shared/hooks';

import { StudentStudyNoteForm } from '../schemas/study-note';

const RequiredMark = () => <span className="text-key-color-primary"> *</span>;

export const StudentStudyNoteFields = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<StudentStudyNoteForm>();
  const { data: subjects = [] } = useSubjectList();

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
            placeholder="학습 노트의 제목을 입력해주세요."
          />
        </Form.Control>
        <Form.ErrorMessage className="text-system-warning text-sm">
          {errors.title?.message}
        </Form.ErrorMessage>
      </Form.Item>

      {/* 학습 날짜 */}
      <Form.Item error={!!errors.studiedAt}>
        <Form.Label>
          학습 날짜
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <div className="tablet:w-1/2">
            <Input
              {...register('studiedAt')}
              type="date"
            />
          </div>
        </Form.Control>
        {errors.studiedAt && (
          <Form.ErrorMessage className="text-system-warning text-sm">
            {errors.studiedAt.message}
          </Form.ErrorMessage>
        )}
      </Form.Item>

      {/* 과목 */}
      <Form.Item error={!!errors.subject}>
        <Form.Label>
          과목
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <div className="tablet:w-1/2">
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={!!errors.subject}
                >
                  <Select.Trigger placeholder="과목을 선택해 주세요." />
                  <Select.Content>
                    {subjects.map(({ code, name }) => (
                      <Select.Option
                        key={code}
                        value={code}
                      >
                        {name}
                      </Select.Option>
                    ))}
                  </Select.Content>
                </Select>
              )}
            />
          </div>
        </Form.Control>
        {errors.subject && (
          <Form.ErrorMessage className="text-system-warning text-sm">
            {errors.subject.message}
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
            render={({ field }) => (
              <TextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="학습 중에 적은 내용(= 기존에 적어놓은 내용)이 유지되도록 부탁드려요"
              />
            )}
          />
        </Form.Control>
      </Form.Item>
    </>
  );
};

export const StudentStudyNoteSubmitButton = ({
  isPending,
}: {
  isPending?: boolean;
}) => {
  const {
    formState: { isValid, isSubmitting },
  } = useFormContext<StudentStudyNoteForm>();

  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        disabled={!isValid || isPending || isSubmitting}
        className="w-[200px] rounded-sm"
      >
        {isPending ? '저장 중...' : '저장하기'}
      </Button>
    </div>
  );
};
