'use client';

import { Controller, useFormContext } from 'react-hook-form';

import Image from 'next/image';

import { CreateStepForm } from '@/features/study-rooms';
import { TextEditor } from '@/shared/components/editor';
import { RequiredMark } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Select } from '@/shared/components/ui/select';

export default function StepOne({ onNext, disabled }: CreateStepForm) {
  const { register, control, watch } = useFormContext();
  const description = watch('description') ?? '';

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
      <Form.Item className="mt-8">
        <Form.Label className="font-headline1-heading text-gray-11">
          스터디룸 이름을 지어주세요
          <RequiredMark />
        </Form.Label>
        <Input
          className="border-line-line2"
          {...register('name')}
          required
        />
      </Form.Item>

      <Form.Item className="mt-8">
        <Form.Label className="font-headline1-heading text-gray-11">
          스터디룸을 간단하게 소개해주세요
          <RequiredMark />
        </Form.Label>
        <textarea
          placeholder="(예: 내신 성적 향상을 목표로 과목별 학습과 문제풀이를 함께 진행하는 고등학생 전용 스터디룸입니다. 체계적인 관리로 꾸준한 학습 습관을 만듭니다.)"
          className="border-line-line2 placeholder:text-gray-scale-gray-50 focus-visible:border-line-line3 disabled:border-text-inactive disabled:bg-gray-scale-gray-1 disabled:text-text-inactive read-only:border-light-gray-30 read-only:gray-scale-gray-5 read-only:text-gray-scale-gray-50 h-[140px] w-full resize-none rounded-[4px] border px-[24px] py-[16px] align-top outline-none"
          maxLength={200}
          {...register('description')}
          required
        />
        <p className="text-gray-scale-gray-60 mt-2 text-right text-sm">
          {description.length}/200
        </p>
      </Form.Item>

      <Form.Item className="mt-8">
        <Form.Label className="font-headline1-heading text-gray-11">
          스터디룸의 특징을 소개해주세요
        </Form.Label>
        <div className="w-full">
          <Controller
            name="characteristic"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextEditor
                value={field.value ?? ''}
                onChange={field.onChange}
                placeholder={`이미지나 링크를 활용해 학습 방식, 분위기, 성과를 함께 보여주면 더 효과적이에요!\n (예: 커리큘럼 이미지, 실제 후기, 성적 향상 사례 링크 등)`}
              />
            )}
          />
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
      <div className="text-text-sub2 my-6">
        <h3>스터디룸 공개 범위 설정</h3>
        <p>
          스터디룸은 모든 사용자에게 공개하거나 비공개로 설정할 수 있습니다.
        </p>
        <p>비공개로 설정하면 스터디룸에 초대된 사용자만 조회할 수 있습니다.</p>
      </div>
      <div className="ml-auto w-fit">
        <Button
          className="w-48"
          type="button"
          onClick={onNext}
          disabled={disabled}
        >
          다음
        </Button>
      </div>
    </>
  );
}
