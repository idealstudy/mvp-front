import { Icon } from '@/components/ui/icon';
import { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ui/Icon',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return <Icon.Plus />;
  },
};

export const Color: Story = {
  render: () => {
    return <Icon.EllipsisVertical className="text-key-color-primary" />;
  },
};
