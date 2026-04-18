'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';

import { MoreContentsHeader } from '../more-contents-header';
import { QnAList } from './qna-list';

export const QnA = () => {
  const { member } = useAuth();
  const isTeacher = member?.role === 'ROLE_TEACHER';

  return (
    <div className="flex min-h-[calc(100vh-76px)] w-full flex-col">
      <MoreContentsHeader
        isTeacher={isTeacher}
        kind="QNA"
      />
      <QnAList isTeacher={isTeacher} />
    </div>
  );
};
