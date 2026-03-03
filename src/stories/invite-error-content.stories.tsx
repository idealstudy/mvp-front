import { InviteErrorContent } from '@/features/invite';
import type { ErrorReason } from '@/features/invite/types';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'invite/InviteErrorContent',
  component: InviteErrorContent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    reason: {
      control: 'select',
      options: [
        'ROLE_NOT_MATCH',
        'ALREADY_PARTICIPATED',
        'CLOSED',
        'EXPIRED_LINK',
        'INVALID_LINK',
      ] satisfies ErrorReason[],
      description: '에러 사유',
    },
  },
} satisfies Meta<typeof InviteErrorContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RoleNotMatch: Story = {
  args: {
    reason: 'ROLE_NOT_MATCH',
  },
};

export const AlreadyParticipated: Story = {
  args: {
    reason: 'ALREADY_PARTICIPATED',
  },
};

export const Closed: Story = {
  args: {
    reason: 'CLOSED',
  },
};

export const ExpiredLink: Story = {
  args: {
    reason: 'EXPIRED_LINK',
  },
};

export const InvalidLink: Story = {
  args: {
    reason: 'INVALID_LINK',
  },
};
