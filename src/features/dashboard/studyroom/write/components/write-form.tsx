'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const RequiredMark = () => {
  return <span className="text-key-color-primary"> *</span>;
};

const WriteForm = () => {
  return (
    <Form className="space-y-8">
      <Form.Item>
        <Form.Label>
          제목
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <Input
            type="text"
            placeholder="수업 노트의 제목을 입력해주세요."
          />
        </Form.Control>
      </Form.Item>

      <Form.Item>
        <Form.Label>
          수업 대상
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <Input
            type="text"
            placeholder="이 수업을 들은 학생을 선택해 주세요"
          />
        </Form.Control>
      </Form.Item>

      <Form.Item>
        <Form.Label>
          수업 날짜
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <Input
            type="date"
            placeholder="이 수업을 들은 학생을 선택해 주세요"
            className="w-1/2"
          />
        </Form.Control>
      </Form.Item>

      <Form.Item>
        <Form.Label>
          내용
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <div className="border-text-sub2 h-[300px] rounded-xl border bg-slate-50 p-10">
            에디터 영역
          </div>
        </Form.Control>
      </Form.Item>

      <Form.Item>
        <Form.Label>
          공개 범위
          <RequiredMark />
        </Form.Label>
        <Form.Control>
          <div className="flex gap-x-5">
            <Select defaultValue="range">
              <Select.Trigger
                placeholder="범위를 선택하세요"
                className="w-1/2"
              />
              <Select.Content>
                <Select.Option value="me">나만 보기</Select.Option>
                <Select.Option value="onlyStudent">수업대상학생</Select.Option>
                <Select.Option value="iDontKnow">몰라</Select.Option>
              </Select.Content>
            </Select>
            <Checkbox.Label
              htmlFor="agree"
              className="gap-x-2"
            >
              <Checkbox id="agree" />
              보호자에게 공개
            </Checkbox.Label>
          </div>
        </Form.Control>
        <Form.Description className="text-text-sub2 text-sm">
          {`${"'보호자 공개'"} 선택시, 수업 대상 학생과 연결된 보호자도 이 수업노트를 볼 수 있습니다.`}
        </Form.Description>
      </Form.Item>
      <div className="flex justify-end">
        <Button
          type="submit"
          className="w-[200px] rounded-[1px]"
        >
          저장하기
        </Button>
      </div>
    </Form>
  );
};

export default WriteForm;
