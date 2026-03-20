'use client';

import React, { useState } from 'react';

import { useParams, usePathname } from 'next/navigation';

import BackLink from '@/features/dashboard/studynote/components/back-link';
import { HomeworkTabShell } from '@/features/homework/components/homework-tab-shell';
import { StudyNoteTab } from '@/features/study-notes/components/study-note-tab';
import { StudyNoteGroupContext } from '@/features/study-notes/contexts/study-note-group.context';
import { StudyroomSidebar } from '@/features/study-rooms/components/sidebar';
import { ColumnLayout } from '@/layout/column-layout';
import { useRole } from '@/shared/hooks/use-role';

type LayoutProps = {
  children: React.ReactNode;
};

export default function HomeworkLayout({ children }: LayoutProps) {
  const { role } = useRole();
  const params = useParams();
  const path = usePathname();
  const studyRoomId = Number(params.id);

  const [selectedGroupId, setSelectedGroupId] = useState<number | 'all'>('all');

  const pathSegments = path.split('/').filter(Boolean);
  const segment = pathSegments[pathSegments.length - 1];
  const secondLastSegment = pathSegments[pathSegments.length - 2];

  const isHomeworkRootPage = segment === 'homework';
  const isHomeworkDetailPage =
    secondLastSegment === 'homework' && segment !== 'new';

  if (isHomeworkRootPage) {
    return (
      <StudyNoteGroupContext.Provider
        value={{ selectedGroupId, setSelectedGroupId }}
      >
        <ColumnLayout>
          <ColumnLayout.Left>
            <StudyroomSidebar
              studyRoomId={studyRoomId}
              segment={segment}
              selectedGroupId={selectedGroupId}
              onSelectGroup={setSelectedGroupId}
            />
          </ColumnLayout.Left>
          <ColumnLayout.Right className="desktop:max-w-[740px] desktop:px-8 flex h-[400px] flex-col gap-3 rounded-[12px]">
            <div>
              <StudyNoteTab
                mode={role}
                studyRoomId={studyRoomId}
                path={segment}
              />
              <div className="border-line-line1 flex flex-col gap-9 rounded-tr-[12px] rounded-b-[12px] border bg-white p-8">
                <HomeworkTabShell
                  mode={role}
                  path={segment}
                  studyRoomId={studyRoomId}
                />
              </div>
            </div>
            {children}
          </ColumnLayout.Right>
        </ColumnLayout>
      </StudyNoteGroupContext.Provider>
    );
  }

  if (isHomeworkDetailPage) {
    return (
      <ColumnLayout className="items-start">
        <div className="flex w-full flex-col">
          <BackLink />
          <div className="desktop:flex-row desktop:items-start desktop:p-6 flex w-full flex-col gap-6">
            {children}
          </div>
        </div>
      </ColumnLayout>
    );
  }

  return (
    <ColumnLayout className="items-start">
      <div className="flex w-full flex-col">
        <BackLink />
        {children}
      </div>
    </ColumnLayout>
  );
}
