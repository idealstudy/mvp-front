'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function Home() {
  return (
    <main className="my-8 flex h-dvh flex-col items-center justify-center gap-4">
      <Button className="min-w-[270px]">버튼</Button>
      <Button
        className="min-w-[270px]"
        disabled
      >
        버튼
      </Button>
      <Button
        className="min-w-[270px]"
        variant="secondary"
      >
        버튼
      </Button>
      <Button
        className="min-w-[270px]"
        variant="secondary"
        disabled
      >
        버튼
      </Button>
      <Input className="min-w-[270px]" />
      <Input
        className="min-w-[270px]"
        disabled
      />
      <Input
        className="min-w-[270px]"
        aria-invalid
      />
      <Form>
        <Form.Item error>
          <Form.Label>인풋 타이틀</Form.Label>
          <Form.Control>
            <Input className="min-w-[270px]" />
          </Form.Control>
          <Form.ErrorMessage>올바른 이메일 형식이 아닙니다.</Form.ErrorMessage>
        </Form.Item>
      </Form>
      <Checkbox.Group className="flex flex-col gap-4">
        <Checkbox />
        <Checkbox defaultChecked />
        <Checkbox disabled />
        <Checkbox
          disabled
          defaultChecked
        />
        <Checkbox.Label>
          <Checkbox />
          서비스 이용약관에 동의합니다.
        </Checkbox.Label>
      </Checkbox.Group>
    </main>
  );
}
