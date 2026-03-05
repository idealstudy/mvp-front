'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  useStudentDashboardQnaListQuery,
  useTeacherDashboardQnaListQuery,
} from '@/features/dashboard/hooks/use-dashboard-query';

import QnASectionContent from '../section-content/qna-section-content';
import DashboardSection from './single-section';

type Props = {
  className?: string;
};

const QnASection = ({ className }: Props) => {
  const { member } = useAuth();
  const isTeacher = member?.role === 'ROLE_TEACHER';
  const { data: teacherQnaData, isPending: isTeacherPending } =
    useTeacherDashboardQnaListQuery({
      page: 0,
      size: 3,
      sortKey: 'LATEST',
      enabled: isTeacher,
    });
  const { data: studentQnaData, isPending: isStudentPending } =
    useStudentDashboardQnaListQuery({
      page: 0,
      size: 3,
      sortKey: 'LATEST',
      enabled: !isTeacher,
    });

  const questions =
    (isTeacher ? teacherQnaData : studentQnaData)?.content ?? [];
  const isPending = isTeacher ? isTeacherPending : isStudentPending;

  return (
    <DashboardSection
      title={isTeacher ? '답변이 필요한 질문' : '나의 질문'}
      description={
        isTeacher ? '아직 답변하지 않은 질문만 추렸어요.' : undefined
      }
      className={className}
      isMore={true}
      isMoreHref="/dashboard/qna"
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
