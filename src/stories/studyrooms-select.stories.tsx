import { Select } from '@/features/studyrooms/components/common/select';
import { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'studyroom/Select',
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
        <Select.Trigger />
        <Select.Content>
          <Select.Option value="1">최근 편집순</Select.Option>
          <Select.Option value="2">오래된순</Select.Option>
          <Select.Option value="3">가나다순</Select.Option>
          <Select.Option value="4">수업일자순</Select.Option>
        </Select.Content>
      </Select>
    );
  },
};

export const WithPlaceholder: Story = {
  render: () => {
    return (
      <Select defaultValue="">
        <Select.Trigger placeholder="항목을 선택해주세요" />
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
    return (
      <Select defaultValue="1">
        <Select.Trigger />
        <Select.Content>
          <Select.Option value="1">20개씩</Select.Option>
          <Select.Option value="2">30개씩</Select.Option>
        </Select.Content>
      </Select>
    );
  },
};
