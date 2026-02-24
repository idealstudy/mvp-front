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
    teacherName: {
      control: 'text',
      description: '선생님 이름',
    },
    studyRoomName: {
      control: 'text',
      description: '스터디룸 이름',
    },
  },
} satisfies Meta<typeof InviteLetter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    teacherName: '김영희',
    studyRoomName: '영어 회화 스터디',
  },
};

export const LongNames: Story = {
  args: {
    teacherName: '박수학',
    studyRoomName: '2024년 수능 대비 수학 심화반',
  },
};

export const ShortNames: Story = {
  args: {
    teacherName: '이',
    studyRoomName: '영어',
  },
};
