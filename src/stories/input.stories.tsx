import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

const meta = {
  title: 'ui/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return <Input />;
  },
};

export const WithPlaceholder: Story = {
  render: () => {
    return <Input placeholder="텍스트를 입력해주세요" />;
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <Input
        disabled
        placeholder="텍스트를 입력해주세요"
      />
    );
  },
};

export const Invalid: Story = {
  render: () => {
    return <Input aria-invalid />;
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('');

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      setValue(event.target.value);
    };

    return (
      <Input
        value={value}
        onChange={onChange}
      />
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const EmailForm = z.object({
      email: z.string().email('올바른 이메일 주소를 입력해주세요.'),
    });

    const form = useForm({
      resolver: zodResolver(EmailForm),
      defaultValues: {
        email: '',
      },
    });

    const onSubmit = form.handleSubmit(() => {
      form.reset();
    });

    return (
      <Form onSubmit={onSubmit}>
        <Form.Item error={!!form.formState.errors.email}>
          <Form.Label>이메일</Form.Label>
          <Form.Control>
            <Input
              {...form.register('email')}
              placeholder="이메일을 입력해주세요"
            />
          </Form.Control>
          <Form.Description>이메일 주소를 입력해주세요.</Form.Description>
          <Form.ErrorMessage>
            {form.formState.errors.email?.message}
          </Form.ErrorMessage>
        </Form.Item>
        <Button
          className="mt-6 w-full"
          type="submit"
        >
          제출하기
        </Button>
      </Form>
    );
  },
};
