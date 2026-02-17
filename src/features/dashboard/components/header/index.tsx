'use client';

import Image from 'next/image';

import {
  useStudentDashboardReportQuery,
  useTeacherDashboardReportQuery,
} from '@/features/dashboard/hooks/use-dashboard-query';
import { cn } from '@/shared/lib';
import { useMemberStore } from '@/store';

import { HeaderReport } from './report';

const DashboardHeader = () => {
  const member = useMemberStore((s) => s.member);

  const isTeacher = member?.role === 'ROLE_TEACHER';

  const { data: teacherReport } = useTeacherDashboardReportQuery({
    enabled: isTeacher,
  });
  const { data: studentReport } = useStudentDashboardReportQuery({
    enabled: !isTeacher,
  });

  const teacherStats = [
    {
      value: teacherReport?.studyRoomCount ?? 0,
      unit: '개',
      label: '스터디룸',
    },
    {
      value: teacherReport?.teachingNoteCount ?? 0,
      unit: '개',
      label: '수업노트',
    },
    { value: teacherReport?.studentCount ?? 0, unit: '명', label: '학생' },
    { value: teacherReport?.qnaCount ?? 0, unit: '개', label: '질문' },
  ];

  const studentStats = [
    {
      value: studentReport?.studyRoomCount ?? 0,
      unit: '개',
      label: '스터디룸',
    },
    {
      value: studentReport?.questionCount ?? 0,
      unit: '개',
      label: '나의 질문',
    },
    {
      value: 0,
      unit: '개',
      label: '수집한 답변',
    },
    {
      value: studentReport?.submittedHomeworkCount ?? 0,
      unit: '개',
      label: '제출한 과제',
    },
  ];

  const stats = member?.role === 'ROLE_TEACHER' ? teacherStats : studentStats;

  return (
    <div
      className={cn(
        'bg-system-background flex flex-col items-center gap-3 px-4.5 pt-8 pb-3',
        'tablet:pt-19 tablet:px-20 tablet:pb-0'
      )}
    >
      <div className="relative flex h-fit w-full items-end justify-between">
        {/* 왼쪽: 텍스트 및 통계 */}
        <div
          className={cn(
            'flex h-25 min-w-0 flex-col gap-6',
            'tablet:h-50 desktop:h-55'
          )}
        >
          <p
            className={cn(
              'font-body1-normal text-gray-black',
              'tablet:font-headline1-normal desktop:font-title-normal'
            )}
          >
            <span className="font-bold">{member?.name}</span>{' '}
            {isTeacher ? '선생님' : '님'},
            <br />
            {isTeacher
              ? '오늘은 어떤 수업을 진행하세요?'
              : '학습기록이 차곡차곡 쌓이고 있어요'}
          </p>
          <HeaderReport
            className="tablet:flex hidden"
            stats={stats}
          />
        </div>

        {/* 오른쪽: 일러스트 */}
        <div className="absolute top-0 right-0">
          <Image
            src="/dashboard/dashboard-character.png"
            alt="대시보드 캐릭터"
            width={220}
            height={220}
            sizes="(min-width: 1200px) 220px, (min-width: 768px) 200px, 100px"
            className={cn(
              'h-25 w-25 object-contain',
              'tablet:w-50 tablet:h-50 desktop:w-55 desktop:h-55'
            )}
          />
        </div>
      </div>
      <HeaderReport
        className="tablet:hidden flex"
        stats={stats}
      />
    </div>
  );
};

export default DashboardHeader;
