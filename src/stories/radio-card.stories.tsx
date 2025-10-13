import { RadioCard } from '@/components/ui/radio-card';
import { RadioGroup } from '@/components/ui/radio-group';
import { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ui/RadioCard (RadioGroup)',
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
      <RadioGroup
        defaultValue="1"
        className="flex-row"
      >
        <RadioCard.Item value="1">
          <div className="flex w-64 flex-col gap-1">
            <span className="font-medium">옵션 A</span>
            <span className="text-sm text-gray-500">설명 A</span>
          </div>
        </RadioCard.Item>
        <RadioCard.Item value="2">
          <div className="flex w-64 flex-col gap-1">
            <span className="font-medium">옵션 B</span>
            <span className="text-sm text-gray-500">설명 B</span>
          </div>
        </RadioCard.Item>
        <RadioCard.Item value="3">
          <div className="flex w-64 flex-col gap-1">
            <span className="font-medium">옵션 C</span>
            <span className="text-sm text-gray-500">설명 C</span>
          </div>
        </RadioCard.Item>
      </RadioGroup>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup
      defaultValue="1"
      className="flex-row"
      disabled
    >
      <RadioCard.Item value="1">옵션 1</RadioCard.Item>
      <RadioCard.Item value="2">옵션 2</RadioCard.Item>
      <RadioCard.Item value="3">옵션 3</RadioCard.Item>
    </RadioGroup>
  ),
};

export const ItemDisabled: Story = {
  render: () => (
    <RadioGroup
      defaultValue="1"
      className="flex-row"
    >
      <RadioCard.Item value="1">옵션 1</RadioCard.Item>
      <RadioCard.Item
        value="2"
        disabled
      >
        비활성 옵션
      </RadioCard.Item>
      <RadioCard.Item value="3">옵션 3</RadioCard.Item>
    </RadioGroup>
  ),
};
