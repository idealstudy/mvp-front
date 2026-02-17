import QnASectionContent from '@/features/dashboard/components/section-content/qna-section-content';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'dashboard/QnASectionContent',
  component: QnASectionContent,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof QnASectionContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
