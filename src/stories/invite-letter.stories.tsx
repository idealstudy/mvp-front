import { InviteLetter } from '@/features/invite';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'invite/InviteLetter',
  component: InviteLetter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: '초대장 정보',
    },
    isLoading: {
      control: 'boolean',
      description: '로딩 상태',
    },
    token: {
      control: 'text',
      description: '초대 토큰',
    },
    onOpenLoginModal: { action: '로그인 모달 열기' },
    onOpenExitModal: { action: '거절 모달 열기' },
  },
} satisfies Meta<typeof InviteLetter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      teacherName: '김영희',
      studyRoomName: '영어 회화 스터디',
      message: '스터디룸에 초대합니다.',
    },
    isLoading: false,
    token: 'sample-token',
    onOpenLoginModal: () => {},
    onOpenExitModal: () => {},
  },
};

export const LongNames: Story = {
  args: {
    data: {
      teacherName: '박수학',
      studyRoomName: '2024년 수능 대비 수학 심화반',
      message: '스터디룸에 초대합니다.',
    },
    isLoading: false,
    token: 'sample-token',
    onOpenLoginModal: () => {},
    onOpenExitModal: () => {},
  },
};

export const ShortNames: Story = {
  args: {
    data: {
      teacherName: '이',
      studyRoomName: '영어',
      message: '스터디룸에 초대합니다.',
    },
    isLoading: false,
    token: 'sample-token',
    onOpenLoginModal: () => {},
    onOpenExitModal: () => {},
  },
};

export const Loading: Story = {
  args: {
    data: null,
    isLoading: true,
    token: 'sample-token',
    onOpenLoginModal: () => {},
    onOpenExitModal: () => {},
  },
};
