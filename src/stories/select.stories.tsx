import { useState } from 'react';

import { Select } from '@/components/ui/select';
import { Meta, StoryObj } from '@storybook/react';

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
