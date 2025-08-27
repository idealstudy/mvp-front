import { Meta, StoryObj } from '@storybook/react';

import {
  NotebookIcon,
  PersonIcon,
  QuestionIcon,
  Tabs,
} from '../features/studyrooms/components/common/tabs';

const meta = {
  title: 'studyroom/Tabs',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div>
        <Tabs defaultValue="1">
          <Tabs.List>
            <Tabs.Trigger value="1">
              <NotebookIcon />
              수업노트
            </Tabs.Trigger>
            <Tabs.Trigger value="2">
              <PersonIcon />
              학생
            </Tabs.Trigger>
            <Tabs.Trigger value="3">
              <QuestionIcon />
              질문
            </Tabs.Trigger>
          </Tabs.List>
          <div className="border-line-line1 rounded-b-[12px] border p-8">
            <Tabs.Content value="1">
              <p className="font-headline1-heading whitespace-pre-wrap">
                {'이번엔 어떤 수업을\n진행하셨나요?'}
              </p>
            </Tabs.Content>
            <Tabs.Content value="2">
              <p>학생</p>
            </Tabs.Content>
            <Tabs.Content value="3">
              <p>질문</p>
            </Tabs.Content>
          </div>
        </Tabs>
      </div>
    );
  },
};
