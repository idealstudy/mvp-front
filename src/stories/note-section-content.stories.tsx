import NoteSectionContent from '@/features/dashboard/components/section-content/note-section-content';
import type { Meta, StoryObj } from '@storybook/react';

const mockNotes = [
  {
    id: 1,
    title: '1차 수업 정리 - 이차방정식',
    contentPreview: '이차방정식의 근의 공식과 판별식에 대해 학습했습니다.',
    studyRoomId: 1,
    studyRoomName: '수학 스터디룸',
  },
  {
    id: 2,
    title: '2차 수업 정리 - 인수분해',
    contentPreview: '인수분해 공식과 활용 문제를 풀었습니다.',
    studyRoomId: 1,
    studyRoomName: '수학 스터디룸',
  },
  {
    id: 3,
    title: 'Unit 3 - Present Perfect',
    contentPreview: '현재완료 시제의 용법과 예문 정리',
    studyRoomId: 2,
    studyRoomName: '영어 회화 스터디룸',
  },
];

const meta = {
  title: 'dashboard/NoteSectionContent',
  component: NoteSectionContent,
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
} satisfies Meta<typeof NoteSectionContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TeacherEmpty: Story = {
  args: {
    notes: [],
    page: 1,
    totalPages: 1,
    onPageChange: () => {},
    lastStudyRoomId: 0,
  },
};

export const TeacherWithNotes: Story = {
  args: {
    notes: mockNotes,
    page: 1,
    totalPages: 2,
    onPageChange: () => {},
    lastStudyRoomId: 1,
  },
};

export const StudentWithNotes: Story = {
  args: {
    notes: mockNotes,
    page: 1,
    totalPages: 1,
    onPageChange: () => {},
  },
};
