import { InviteExitModal } from '@/features/invite/components/invite-exit-modal';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'invite/InviteExitModal',
  component: InviteExitModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '모달 열림 상태',
    },
    onClose: { action: '취소 클릭' },
    onConfirm: { action: '확인 클릭' },
  },
} satisfies Meta<typeof InviteExitModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    onConfirm: () => {},
  },
};
