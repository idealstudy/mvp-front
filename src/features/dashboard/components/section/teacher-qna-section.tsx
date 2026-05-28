'use client';

import { useTeacherDashboardQnaListQuery } from '@/features/dashboard/hooks/use-teacher-dashboard-query';
import { trackDashboardQnaMoreClick } from '@/shared/lib/analytics';

import QnASectionContent from '../section-content/qna-section-content';
import DashboardSection from './single-section';

type TeacherQnASectionProps = {
  className?: string;
};

const QNA_CONTENT_MIN_HEIGHT = 'min-h-[264px]';

const TeacherQnASection = ({ className }: TeacherQnASectionProps) => {
  const { data, isPending } = useTeacherDashboardQnaListQuery({
    page: 0,
    size: 3,
    sortKey: 'LATEST',
  });

  return (
    <DashboardSection
      title="답변이 필요한 질문"
      description="아직 답변하지 않은 질문만 추렸어요."
      className={className}
      isMore={true}
      isMoreHref="/dashboard/qna"
      isMorePrefetch={false}
      onMoreClick={() => trackDashboardQnaMoreClick('ROLE_TEACHER')}
    >
      <div className={QNA_CONTENT_MIN_HEIGHT}>
        {isPending ? (
          <div className="flex w-full flex-col gap-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-3 h-[84px] w-full animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : (
          <QnASectionContent questions={data?.content ?? []} />
        )}
      </div>
    </DashboardSection>
  );
};

export default TeacherQnASection;
