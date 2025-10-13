'use client';

import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function StepThree({ disabled }: { disabled?: boolean }) {
  const { register } = useFormContext();
  return (
    <>
      <Form.Item>
        <Form.Label className="text-2xl font-semibold">
          초대할 학생이 있나요?
        </Form.Label>
        <Input
          {...register('emails')}
          placeholder="초대할 사람을 검색 후 선택해주세요"
          className="mt-6"
        />
      </Form.Item>
      <ul className="mt-2 space-y-1 text-sm text-gray-600">
        <li>학생을 초대하면 연결된 보호자는 자동으로 함께 입장합니다.</li>
        <li>
          각 수업 노트는 보호자에게 공개하거나 비공개로 설정할 수 있습니다.
        </li>
        <li>학생과 연결되지 않은 보호자는 스터디룸에 입장할 수 없습니다.</li>
      </ul>
      <div className="mt-10 flex items-center justify-between space-y-4">
        <p className="text-muted-foreground bg-key-color-secondary mb-0 rounded-md p-2 text-sm">
          학생을 초대하지 않아도 스터디룸 기능을 먼저 사용할 수 있어요
        </p>
        <Button
          type="submit"
          className="w-48"
          disabled={disabled}
        >
          {disabled ? '생성 중...' : '완료'}
        </Button>
      </div>
    </>
  );
}
