'use client';

import { Controller, useFormContext } from 'react-hook-form';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { TextEditor } from '@/features/editor/components/text-editor';
import { CreateStepForm } from '@/features/studyrooms/types';

export default function StepOne({ onNext, disabled }: CreateStepForm) {
  const { register, control } = useFormContext();

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
        <Form.Label className="text-2xl font-semibold">
          스터디룸 이름을 지어주세요
        </Form.Label>
        <Input
          className="border-line-line2"
          {...register('name')}
        />
      </Form.Item>
      <Form.Item className="mt-8">
        <Form.Label className="text-2xl font-semibold">
          스터디룸 설명을 지어주세요
        </Form.Label>
        <div className="w-full">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="수업 내용을 작성해보세요."
              />
            )}
          />
        </div>
      </Form.Item>
      <Form.Item className="mt-8">
        <Form.Label className="text-2xl font-semibold">
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
