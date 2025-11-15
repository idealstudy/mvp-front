'use client';

import React, { useEffect } from 'react';

import { useParams, usePathname, useRouter } from 'next/navigation';

import { StudyNoteTab } from '@/features/study-notes/components/study-note-tab';
import StudyNoteTabShell from '@/features/study-notes/components/study-note-tab-shell';
import { StudyroomSidebar } from '@/features/study-rooms/components/sidebar';
import { ColumnLayout } from '@/layout/column-layout';
import { useRole } from '@/shared/hooks/use-role';

type LayoutProps = {
  children: React.ReactNode;
};

const StudyNoteLayout = ({ children }: LayoutProps) => {
  const { role, isLoading } = useRole();
  const path = usePathname();
  const params = useParams();
  const router = useRouter();
  const studyRoomId = Number(params.id);
  const segment = path.split('/').pop();

  // 권한 체크
  // Todo: 추후 미들웨어에서 처리하도록 변경
  useEffect(() => {
    if (isLoading) return;
    if (segment === 'member' && role !== 'ROLE_TEACHER') {
      router.replace(`/`);
    }
  }, [role, segment, isLoading, router, studyRoomId]);

  return (
    <ColumnLayout>
      <ColumnLayout.Left className="rounded-[12px] bg-gray-200">
        <StudyroomSidebar
          studyRoomId={studyRoomId}
          segment={segment === 'note' ? 'note' : undefined}
        />
      </ColumnLayout.Left>
      <ColumnLayout.Right className="desktop:max-w-[740px] flex h-[400px] flex-col gap-3 rounded-[12px] px-8">
        <div>
          <StudyNoteTab
            mode={role}
            studyRoomId={studyRoomId}
            path={segment!}
          />
          <div className="border-line-line1 flex flex-col gap-9 rounded-tr-[12px] rounded-b-[12px] border bg-white p-8">
            <StudyNoteTabShell
              mode={role}
              path={segment!}
            />
            {segment !== 'note' && children}
          </div>
        </div>
        {segment === 'note' && children}
      </ColumnLayout.Right>
    </ColumnLayout>
  );
};

export default StudyNoteLayout;
