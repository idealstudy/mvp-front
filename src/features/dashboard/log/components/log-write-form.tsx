'use client';

import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TagInput } from '@/components/ui/tag-input';
import { LogValues, logSchema } from '@/features/auth/schemas/log';
import { zodResolver } from '@hookform/resolvers/zod';

const LogFormtwStyles = {
  wrapper: 'mt-12 w-full flex flex-col gap-y-7',
  itemWrapper: 'flex items-center',
  label: 'min-w-[108px] text-base flex items-center font-bold m-0',
  message: 'text-right',
};

const studentOptions = ['홍길동', '김영희', '이철수', '박지민'];

const LogWriteForm = () => {
  // NEXT_TODO : API 연결하기

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LogValues>({
    resolver: zodResolver(logSchema),
  });

  const onSubmit = () => {};

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className={LogFormtwStyles.wrapper}
    >
      <Form.Item error={!!errors.title}>
        <div className={LogFormtwStyles.itemWrapper}>
          <Form.Label className={LogFormtwStyles.label}>제목</Form.Label>
          <Form.Control>
            <Input
              type="text"
              {...register('title')}
            />
          </Form.Control>
        </div>
        <Form.ErrorMessage className={LogFormtwStyles.message}>
          {errors.title?.message}
        </Form.ErrorMessage>
      </Form.Item>

      <Form.Item error={!!errors.date}>
        <div className={LogFormtwStyles.itemWrapper}>
          <Form.Label className={LogFormtwStyles.label}>수업 일시</Form.Label>
          <Form.Control>
            <Input
              type="date"
              {...register('date')}
              className="w-[225px]"
            />
          </Form.Control>
        </div>
        <Form.ErrorMessage className={LogFormtwStyles.message}>
          {errors.date?.message}
        </Form.ErrorMessage>
      </Form.Item>

      <Form.Item error={!!errors.students}>
        <div className={LogFormtwStyles.itemWrapper}>
          <Form.Label className={LogFormtwStyles.label}>대상 학생</Form.Label>
          <Form.Control>
            <Controller
              name="students"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <TagInput
                  options={studentOptions}
                  value={field.value}
                  onChange={field.onChange}
                  hasError={!!errors.students}
                  popoverButtonText="학생 선택"
                  maxTags={10}
                />
              )}
            />
          </Form.Control>
        </div>
        <Form.ErrorMessage className={LogFormtwStyles.message}>
          {errors.students?.message}
        </Form.ErrorMessage>
      </Form.Item>

      <Form.Item error={!!errors.contents}>
        <div className={LogFormtwStyles.itemWrapper}>
          <Form.Label className={LogFormtwStyles.label}>내용</Form.Label>
          <Form.Control>
            <Input
              type="text"
              {...register('contents')}
            />
          </Form.Control>
        </div>
        <Form.ErrorMessage className={LogFormtwStyles.message}>
          {errors.contents?.message}
        </Form.ErrorMessage>
      </Form.Item>

      <div className="flex w-full justify-end">
        <Button
          type="submit"
          className="w-[150px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? '작성 중...' : '작성 완료'}
        </Button>
      </div>
    </Form>
  );
};

export default LogWriteForm;
