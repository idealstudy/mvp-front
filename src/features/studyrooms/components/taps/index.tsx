'use client';

import {
  NotebookIcon,
  PersonIcon,
  QuestionIcon,
  Tabs,
} from '@/features/studyrooms/components/common/tabs';

import { StudyNote } from './study-note';

export const StudyRoomTabs = () => {
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
        <div className="border-line-line1 rounded-tr-[12px] rounded-b-[12px] border bg-white p-8">
          <Tabs.Content
            value="1"
            className="flex flex-col gap-8"
          >
            <StudyNote />
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
};
