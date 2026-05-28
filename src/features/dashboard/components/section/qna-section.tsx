'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { useStudentDashboardQnaListQuery } from '@/features/dashboard/hooks/use-student-dashboard-query';
import { trackDashboardQnaMoreClick } from '@/shared/lib/analytics';

import QnASectionContent from '../section-content/qna-section-content';
import DashboardSection from './single-section';

type Props = {
  className?: string;
};

const QnASection = ({ className }: Props) => {
  const { member } = useAuth();
  const { data: studentQnaData, isPending } = useStudentDashboardQnaListQuery({
    page: 0,
    size: 3,
    sortKey: 'LATEST',
    enabled: member?.role === 'ROLE_STUDENT',
  });

  const questions = studentQnaData?.content ?? [];

  return (
    <DashboardSection
      title="나의 질문"
      className={className}
      isMore={true}
      isMoreHref="/dashboard/qna"
      isMorePrefetch={false}
      onMoreClick={() => trackDashboardQnaMoreClick(member?.role)}
    >
      {isPending ? (
        <div className="flex w-full flex-col gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-3 h-12 w-full animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : (
        <QnASectionContent questions={questions} />
      )}
    </DashboardSection>
  );
};

export default QnASection;
