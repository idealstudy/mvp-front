import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

const meta = {
  title: 'ui/Form',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const formSchema = z.object({
      name: z.string().min(1, '이름을 입력해주세요.'),
    });

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
      },
    });

    const onSubmit = form.handleSubmit(() => {});

    return (
      <Form onSubmit={onSubmit}>
        <Form.Item error={!!form.formState.errors.name}>
          <Form.Label required>이름</Form.Label>
          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <Form.Control>
                <Input
                  {...field}
                  placeholder="이름을 입력해주세요."
                />
              </Form.Control>
            )}
          />
          <Form.ErrorMessage>
            {form.formState.errors.name?.message}
          </Form.ErrorMessage>
        </Form.Item>
        <Button
          type="submit"
          className="mt-4"
          size="small"
        >
          제출하기
        </Button>
      </Form>
    );
  },
};
