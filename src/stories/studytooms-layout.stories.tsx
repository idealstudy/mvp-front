import Image from 'next/image';

import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DropdownMenu } from '../components/ui/dropdown-menu';
import { StudyRoomDetailLayout } from '../features/studyrooms/components/common/layout';
import { ListItem } from '../features/studyrooms/components/common/list-item';
import { StudyNotesList } from '../features/studyrooms/components/studynotes/list';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const meta: Meta<typeof StudyRoomDetailLayout> = {
  title: 'studyroom/Layout',
  component: StudyRoomDetailLayout,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
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

export const StudyroomStudentsListItem: Story = {
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
        <ListItem
          id={1}
          title="김뎨듀"
          tag={
            <div className="flex flex-row items-center gap-2">
              <div className="bg-line-line2 h-[13px] w-px" />
              <span className="font-caption-normal text-key-color-primary">
                보호자 1
              </span>
            </div>
          }
          subtitle="kimdedu@dedu.com"
          date="3일전 가입"
          href="/"
          icon={
            <Image
              src="/invite/invite-type.svg"
              alt="invite-type"
              width={28}
              height={28}
            />
          }
          dropdown={
            <DropdownMenu>
              <DropdownMenu.Trigger>
                <Image
                  src="/studynotes/gray-kebab.svg"
                  width={24}
                  height={24}
                  alt="menu"
                  className="cursor-pointer"
                />
              </DropdownMenu.Trigger>
            </DropdownMenu>
          }
        />
      </StudyRoomDetailLayout>
    </div>
  ),
};
