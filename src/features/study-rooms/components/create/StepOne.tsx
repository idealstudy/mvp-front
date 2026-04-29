'use client';

import { Controller, useFormContext } from 'react-hook-form';

import Image from 'next/image';

import { CreateStepForm, StudyRoomFormValues } from '@/features/study-rooms';
import { TextEditor, parseEditorContent } from '@/shared/components/editor';
import { RequiredMark, Textarea } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Select } from '@/shared/components/ui/select';
import { toPlainText } from '@/shared/lib';

export default function StepOne({
  onNext,
  disabled,
  mode,
  onCancel,
  onRequestEdit,
  canSubmitEdit,
}: CreateStepForm) {
  const {
    register,
    control,
    watch,
    formState: { errors, isDirty },
  } = useFormContext<StudyRoomFormValues>();
  const description = watch('description') ?? '';
  const characteristic = watch('characteristic') ?? '';
  const characteristicLength = toPlainText(characteristic).length;

  return (
    <>
      <Image
        alt="select-area"
        loading="lazy"
        width="100"
        height="200"
        decoding="async"
        data-nimg="1"
        className="bg-orange-scale-orange-1 w-full rounded-[12px] p-[14px]"
        src="/studyroom/study-room-hero.svg"
      />
      <Form.Item
        className="mt-8"
        error={!!errors.name}
      >
        <Form.Label className="font-headline1-heading text-gray-11">
          스터디룸 이름을 지어주세요
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <Input
            className="border-line-line2"
            {...register('name')}
            placeholder="스터디룸 이름을 입력해주세요"
            required
            data-testid="study-room-name-input"
          />
        </Form.Control>
        <Form.ErrorMessage>{errors.name?.message}</Form.ErrorMessage>
      </Form.Item>

      <Form.Item
        className="mt-8"
        error={!!errors.description}
      >
        <Form.Label className="font-headline1-heading text-gray-11">
          스터디룸을 간단하게 소개해주세요
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <Textarea
            placeholder="(예: 내신 성적 향상을 목표로 과목별 학습과 문제풀이를 함께 진행하는 고등학생 전용 스터디룸입니다. 체계적인 관리로 꾸준한 학습 습관을 만듭니다.)"
            className="border-line-line2 h-full w-full resize-none rounded-sm"
            maxLength={200}
            {...register('description')}
            required
            data-testid="study-room-description-textarea"
          />
        </Form.Control>

        {errors.description?.message ? (
          <div className="flex justify-between">
            <Form.ErrorMessage>{errors.description?.message}</Form.ErrorMessage>
            <p className="text-gray-scale-gray-60 mt-2 text-sm">
              {description.length}/200
            </p>
          </div>
        ) : (
          <p className="text-gray-scale-gray-60 mt-2 text-right text-sm">
            {description.length}/200
          </p>
        )}
      </Form.Item>

      <Form.Item
        className="mt-8"
        error={!!errors.characteristic}
      >
        <Form.Label className="font-headline1-heading text-gray-11">
          스터디룸의 특징을 소개해주세요
        </Form.Label>
        <div className="w-full">
          <Form.Control>
            <Controller
              name="characteristic"
              control={control}
              render={({ field }) => (
                <TextEditor
                  value={field.value ?? parseEditorContent('')}
                  onChange={field.onChange}
                  placeholder={`이미지나 링크를 활용해 학습 방식, 분위기, 성과를 함께 보여주면 더 효과적이에요!\n (예: 커리큘럼 이미지, 실제 후기, 성적 향상 사례 링크 등)`}
                />
              )}
            />
          </Form.Control>
          {errors.characteristic?.message ? (
            <div className="flex justify-between">
              <Form.ErrorMessage>
                {typeof errors.characteristic?.message === 'string'
                  ? errors.characteristic.message
                  : undefined}
              </Form.ErrorMessage>
              <p className="text-gray-scale-gray-60 mt-2 text-sm">
                {characteristicLength}/3000
              </p>
            </div>
          ) : (
            <p className="text-gray-scale-gray-60 mt-2 text-right text-sm">
              {characteristicLength}/3000
            </p>
          )}
        </div>
      </Form.Item>

      <Form.Item className="mt-8">
        <Form.Label className="font-headline1-heading text-gray-11">
          스터디룸의 공개 범위
        </Form.Label>
        <Controller
          name="visibility"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              name={field.name}
              onValueChange={field.onChange}
            >
              <Select.Trigger
                className="w-[240px]"
                placeholder="공개 범위 선택"
              />
              <Select.Content>
                <Select.Option value="PUBLIC">전체 공개</Select.Option>
                <Select.Option value="PRIVATE">비공개</Select.Option>
              </Select.Content>
            </Select>
          )}
        />
      </Form.Item>
      <div className="text-text-sub2 my-4 text-sm">
        <p>
          스터디룸은 모든 사용자에게 공개하거나 비공개로 설정할 수 있습니다.
        </p>
        <p>비공개로 설정하면 스터디룸에 초대된 사용자만 조회할 수 있습니다.</p>
      </div>

      <div className="mt-10 flex justify-between">
        {mode === 'edit' && (
          <Button
            variant="outlined"
            className="tablet:w-48"
            type="button"
            onClick={onCancel}
            data-testid="study-room-cancel-button"
          >
            취소
          </Button>
        )}
        <div className="ml-auto flex gap-2">
          <Button
            variant="secondary"
            className="tablet:w-48"
            type="button"
            onClick={onNext}
            disabled={disabled}
            data-testid="study-room-next-button"
          >
            다음
          </Button>
          {mode === 'edit' && (
            <Button
              type="button"
              className="tablet:w-48"
              disabled={disabled || !(canSubmitEdit ?? isDirty)}
              onClick={onRequestEdit}
              data-testid="study-room-edit-button"
            >
              {disabled ? '수정 중...' : '수정하기'}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
