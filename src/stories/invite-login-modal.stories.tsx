import { InviteLoginModal } from '@/features/invite/components/invite-login-modal';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'invite/InviteLoginModal',
  component: InviteLoginModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '모달 열림 상태',
    },
  },
} satisfies Meta<typeof InviteLoginModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    inviteToken: 'sample-invite-token-123',
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    inviteToken: 'sample-invite-token-123',
  },
};
