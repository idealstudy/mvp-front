'use client';

import { Controller, useForm } from 'react-hook-form';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import TagInput from '@/features/dashboard/studynote/write/components/tag-input';
import { TextEditor } from '@/features/editor/components/text-editor';

// 또는 TextEditor에서 export한 타입

const RequiredMark = () => {
  return <span className="text-key-color-primary"> *</span>;
};

const sampleStudents = [
  { id: '1', name: '조새하', guardian: '보호자' },
  { id: '2', name: '김민수', guardian: '보호자' },
  { id: '3', name: '이영희' },
  { id: '4', name: '박철수', guardian: '보호자' },
  { id: '5', name: '최지영' },
  { id: '6', name: '정수현', guardian: '보호자' },
  { id: '7', name: '한소영' },
  { id: '8', name: '윤대호', guardian: '보호자' },
  { id: '9', name: '강미나' },
  { id: '10', name: '조현우', guardian: '보호자' },
  { id: '11', name: '신예린' },
  { id: '12', name: '오준석', guardian: '보호자' },
  { id: '13', name: '임하은' },
  { id: '14', name: '송지훈', guardian: '보호자' },
  { id: '15', name: '배수진' },
];

const WriteForm = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      classTarget: '',
      classDate: new Date().toISOString().split('T')[0],
      students: [],
      content: {},
      visibility: 'me',
      guardianVisible: false,
    },
  });

  const onSubmit = async () => {
    alert('수업 노트가 저장되었습니다!');
  };

  return (
    <Form className="space-y-8">
      <Form.Item>
        <Form.Label>
          제목
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <Input
            {...register('title', {
              required: '제목을 입력해주세요.',
            })}
            type="text"
            placeholder="수업 노트의 제목을 입력해주세요."
          />
        </Form.Control>
        {errors.title && (
          <Form.Description className="text-sm text-red-500">
            {errors.title.message}
          </Form.Description>
        )}
      </Form.Item>

      <Form.Item>
        <Form.Label>
          수업 대상
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <Controller
            name="students"
            control={control}
            rules={{ required: '수업 대상 학생을 선택해주세요.' }}
            render={({ field }) => (
              <TagInput
                students={sampleStudents}
                selected={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Form.Control>
        {errors.students && (
          <Form.Description className="text-sm text-red-500">
            {errors.students.message}
          </Form.Description>
        )}
      </Form.Item>

      <Form.Item>
        <Form.Label>
          수업 날짜
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <Input
            {...register('classDate', {
              required: '수업 날짜를 선택해주세요.',
            })}
            type="date"
          />
        </Form.Control>
        {errors.classDate && (
          <Form.Description className="text-sm text-red-500">
            {errors.classDate.message}
          </Form.Description>
        )}
      </Form.Item>

      <Form.Item>
        <Form.Label>
          내용
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <Controller
            name="content"
            control={control}
            rules={{ required: '수업 내용을 입력해주세요.' }}
            render={({ field }) => (
              <TextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="수업 내용을 입력해주세요..."
              />
            )}
          />
        </Form.Control>
        {errors.content && (
          <Form.Description className="text-sm text-red-500">
            {errors.content.message}
          </Form.Description>
        )}
      </Form.Item>

      <hr
        style={{
          borderImage:
            'repeating-linear-gradient(to right, gray 0, gray 4px, transparent 4px, transparent 8px)',
          borderImageSlice: 1,
        }}
      />

      <Form.Item>
        <Form.Label>
          공개 범위
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <div className="flex gap-x-5">
            <Controller
              name="visibility"
              control={control}
              rules={{ required: '공개 범위를 선택해주세요.' }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <Select.Trigger
                    placeholder="범위를 선택하세요"
                    className="w-1/2"
                  />
                  <Select.Content>
                    <Select.Option value="me">나만 보기</Select.Option>
                    <Select.Option value="onlyStudent">
                      수업대상학생
                    </Select.Option>
                    <Select.Option value="studyroom">스터디 룸</Select.Option>
                    <Select.Option value="all">전체 공개</Select.Option>
                  </Select.Content>
                </Select>
              )}
            />
            <Controller
              name="guardianVisible"
              control={control}
              render={({ field }) => (
                <Checkbox.Label
                  htmlFor="agree"
                  className="gap-x-2"
                >
                  <Checkbox
                    id="agree"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  보호자에게 공개
                </Checkbox.Label>
              )}
            />
          </div>
        </Form.Control>
        {errors.visibility && (
          <Form.Description className="text-sm text-red-500">
            {errors.visibility.message}
          </Form.Description>
        )}
        <Form.Description className="text-text-sub2 flex gap-x-[3px] text-sm">
          <Image
            src="/common/info.svg"
            alt="info-svg"
            width={16}
            height={16}
          />
          {`${"'보호자 공개'"} 선택시, 수업 대상 학생과 연결된 보호자도 이 수업노트를 볼 수 있습니다.`}
        </Form.Description>
      </Form.Item>

      <div className="flex justify-end">
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-[200px] rounded-sm"
        >
          {isSubmitting ? '저장 중...' : '저장하기'}
        </Button>
      </div>
    </Form>
  );
};

export default WriteForm;
