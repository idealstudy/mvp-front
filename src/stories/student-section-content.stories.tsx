import StudentsSectionContent from '@/features/dashboard/components/section-content/student-section-content';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'dashboard/StudentsSectionContent',
  component: StudentsSectionContent,
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
} satisfies Meta<typeof StudentsSectionContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
