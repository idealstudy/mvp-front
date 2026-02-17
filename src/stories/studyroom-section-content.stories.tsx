import StudyroomSectionContent from '@/features/dashboard/components/section-content/studyroom-section-content';
import type { Meta, StoryObj } from '@storybook/react';

const mockStudyRooms: { id: number; name: string }[] = [
  { id: 1, name: '수학 스터디룸' },
  { id: 2, name: '영어 회화 스터디룸' },
  { id: 3, name: '과학 실험 스터디룸' },
];

const mockStudyRoomsWithLongTitles: { id: number; name: string }[] = [
  { id: 1, name: '매우 긴 스터디룸 이름을 가진 수학 고급 반 A' },
  { id: 2, name: '2024학년도 영어 회화 및 작문 통합 스터디룸' },
  { id: 3, name: '과학 실험과 탐구를 위한 심화 학습반' },
];

const meta = {
  title: 'dashboard/StudyroomSectionContent',
  component: StudyroomSectionContent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StudyroomSectionContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    studyRooms: mockStudyRooms,
    onStudyRoomClick: () => {},
  },
};

export const LongTitles: Story = {
  args: {
    studyRooms: mockStudyRoomsWithLongTitles,
    onStudyRoomClick: () => {},
  },
};
