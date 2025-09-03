import type { Meta, StoryObj } from '@storybook/react';

import { StudyRoomDetailLayout } from '../features/studyrooms/components/common/layout';
import { StudyNotesList } from '../features/studyrooms/components/studynotes/list';

const meta: Meta<typeof StudyRoomDetailLayout> = {
  title: 'studyroom/Layout',
  component: StudyRoomDetailLayout,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof StudyRoomDetailLayout>;

export const Default: Story = {
  render: () => (
    <div className="w-[740px]">
      <StudyRoomDetailLayout
        search=""
        sort="LATEST_EDITED"
        limit={20}
        onSearch={() => {}}
        onSortChange={() => {}}
        onLimitChange={() => {}}
        page={{
          page: 0,
          totalPages: 10,
          onPageChange: () => {},
        }}
      >
        <StudyNotesList
          data={[
            {
              groupId: 1,
              groupName: 'test',
              id: 1,
              taughtAt: '2025-08-31T06:30:26.613',
              teacherName: 'test teacher 1',
              title: 'string',
              updatedAt: '2025-09-03T05:41:37.11843',
              visibility: 'TEACHER_ONLY',
            },
            {
              groupId: null,
              groupName: 'test',
              id: 2,
              taughtAt: '2025-08-31T06:30:26.613',
              teacherName: 'test teacher 1',
              title: 'string',
              updatedAt: '2025-09-03T05:41:37.11843',
              visibility: 'SPECIFIC_STUDENTS_AND_PARENTS',
            },
            {
              groupId: 1,
              groupName: 'test',
              id: 3,
              taughtAt: '2025-08-31T10:30:26.613',
              teacherName: 'test teacher 1',
              title: 'string',
              updatedAt: '2025-09-03T05:41:37.11843',
              visibility: 'SPECIFIC_STUDENTS_AND_PARENTS',
            },
          ]}
          studyRoomId={1}
          pageable={{ page: 0, size: 20, sortKey: 'LATEST_EDITED' }}
          keyword=""
        />
      </StudyRoomDetailLayout>
    </div>
  ),
};
