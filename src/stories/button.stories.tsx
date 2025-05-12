import { Button } from '@/components/ui/button';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'ui/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => {
    return <Button>버튼</Button>;
  },
};

export const Secondary: Story = {
  render: () => {
    return <Button variant="secondary">버튼</Button>;
  },
};
