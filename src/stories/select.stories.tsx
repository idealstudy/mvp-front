import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Select } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

const meta = {
  title: 'ui/Select',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <Select defaultValue="1">
        <Select.Trigger className="w-[240px]" />
        <Select.Content>
          <Select.Option value="1">항목 1</Select.Option>
          <Select.Option value="2">항목 2</Select.Option>
          <Select.Option value="3">항목 3</Select.Option>
        </Select.Content>
      </Select>
    );
  },
};

export const WithPlaceholder: Story = {
  render: () => {
    return (
      <Select defaultValue="">
        <Select.Trigger
          className="w-[240px]"
          placeholder="항목을 선택해주세요"
        />
        <Select.Content>
          <Select.Option value="1">항목 1</Select.Option>
          <Select.Option value="2">항목 2</Select.Option>
          <Select.Option value="3">항목 3</Select.Option>
        </Select.Content>
      </Select>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <Select
        disabled
        defaultValue="1"
      >
        <Select.Trigger
          className="w-[240px]"
          placeholder="항목을 선택해주세요"
        />
        <Select.Content>
          <Select.Option value="1">항목 1</Select.Option>
          <Select.Option value="2">항목 2</Select.Option>
          <Select.Option value="3">항목 3</Select.Option>
        </Select.Content>
      </Select>
    );
  },
};

export const Invalid: Story = {
  render: () => {
    return (
      <Select
        aria-invalid
        defaultValue="1"
      >
        <Select.Trigger
          className="w-[240px]"
          placeholder="항목을 선택해주세요"
        />
        <Select.Content>
          <Select.Option value="1">항목 1</Select.Option>
          <Select.Option value="2">항목 2</Select.Option>
          <Select.Option value="3">항목 3</Select.Option>
        </Select.Content>
      </Select>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('1');

    return (
      <Select
        value={value}
        onValueChange={setValue}
      >
        <Select.Trigger
          className="w-[240px]"
          placeholder="항목을 선택해주세요"
        />
        <Select.Content>
          <Select.Option value="1">항목 1</Select.Option>
          <Select.Option value="2">항목 2</Select.Option>
          <Select.Option value="3">항목 3</Select.Option>
        </Select.Content>
      </Select>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const formSchema = z.object({
      student: z.string().min(1, '학생을 선택해주세요.'),
    });

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        student: '',
      },
    });

    const onSubmit = form.handleSubmit(() => {});

    return (
      <Form onSubmit={onSubmit}>
        <Form.Item error={!!form.formState.errors.student}>
          <Form.Label required>학생</Form.Label>
          <Controller
            name="student"
            control={form.control}
            render={({ field }) => (
              <Form.Control>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <Select.Trigger
                    ref={field.ref}
                    className="w-[240px]"
                    placeholder="학생을 선택해주세요."
                  />
                  <Select.Content>
                    <Select.Option value="1">학생 1</Select.Option>
                    <Select.Option value="2">학생 2</Select.Option>
                    <Select.Option value="3">학생 3</Select.Option>
                  </Select.Content>
                </Select>
              </Form.Control>
            )}
          />
          <Form.ErrorMessage>
            {form.formState.errors.student?.message}
          </Form.ErrorMessage>
        </Form.Item>
        <Button
          className="mt-4"
          size="small"
          type="submit"
        >
          제출하기
        </Button>
      </Form>
    );
  },
};
