'use client';

import Image from 'next/image';

import {
  useParentDashboardReportQuery,
  useStudentDashboardReportQuery,
  useTeacherDashboardReportQuery,
} from '@/features/dashboard/hooks/use-dashboard-query';
import { cn } from '@/shared/lib';
import { useMemberStore } from '@/store';

import { HeaderReport, type HeaderStat } from './report';

const DashboardHeader = () => {
  const member = useMemberStore((s) => s.member);
  const isTeacher = member?.role === 'ROLE_TEACHER';

  const { data: teacherReport, isPending: teacherIsPending } =
    useTeacherDashboardReportQuery({
      enabled: isTeacher,
    });
  const { data: studentReport, isPending: studentIsPending } =
    useStudentDashboardReportQuery({
      enabled: member?.role === 'ROLE_STUDENT',
    });

  const { data: parentReport, isPending: parentIsPending } =
    useParentDashboardReportQuery({
      enabled: member?.role === 'ROLE_PARENT',
    });

  let nameSuffix = '님';

  switch (member?.role) {
    case 'ROLE_TEACHER':
      nameSuffix = '선생님';
      break;
    case 'ROLE_PARENT':
      nameSuffix = '학부모님';
      break;
    default:
      nameSuffix = '님';
  }

  let greetingMessage = '';
  let isPending;

  switch (member?.role) {
    case 'ROLE_TEACHER':
      greetingMessage = '오늘은 어떤 수업을 진행하세요?';
      isPending = teacherIsPending;
      break;
    case 'ROLE_PARENT':
      greetingMessage = '학습 여정을 함께 확인해보세요';
      isPending = parentIsPending;
      break;
    case 'ROLE_STUDENT':
      greetingMessage = '학습기록이 차곡차곡 쌓이고 있어요';
      isPending = studentIsPending;
      break;
    default:
      greetingMessage = '안녕하세요? 디에듀 입니다.';
  }

  const teacherStats: HeaderStat[] = [
    {
      value: teacherReport?.studyRoomCount ?? '-',
      unit: '개',
      label: '스터디룸',
    },
    {
      value: teacherReport?.teachingNoteCount ?? '-',
      unit: '개',
      label: '수업노트',
    },
    { value: teacherReport?.studentCount ?? '-', unit: '명', label: '학생' },
    { value: teacherReport?.qnaCount ?? '-', unit: '개', label: '질문' },
  ];

  const studentStats: HeaderStat[] = [
    {
      value: studentReport?.studyRoomCount ?? '-',
      unit: '개',
      label: '스터디룸',
    },
    {
      value: studentReport?.questionCount ?? '-',
      unit: '개',
      label: '나의 질문',
    },
    // 해당 응답이 없어 임시 0 처리
    {
      value: studentReport?.answerCount ?? '-',
      unit: '개',
      label: '수집한 답변',
    },
    {
      value: studentReport?.submittedHomeworkCount ?? '-',
      unit: '개',
      label: '제출한 과제',
    },
  ];

  const parentStats: HeaderStat[] = [
    { value: parentReport?.studyNews ?? '-', unit: '개', label: '학습 소식' },
    {
      value: parentReport?.waitingInquiries ?? '-',
      unit: '건',
      label: '답변 대기',
    },
    {
      value: parentReport?.answeredInquiries ?? '-',
      unit: '건',
      label: '답변 완료',
    },
    {
      value: parentReport?.myStudentCount ?? '-',
      unit: '명',
      label: '매칭된 학생',
    },
  ];

  let stats: HeaderStat[] = [];

  switch (member?.role) {
    case 'ROLE_TEACHER':
      stats = teacherStats;
      break;
    case 'ROLE_STUDENT':
      stats = studentStats;
      break;
    case 'ROLE_PARENT':
      stats = parentStats;
      break;
    default:
      stats = [];
  }

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
            <span className="font-bold">{member?.name}</span> {nameSuffix},
            <br />
            {greetingMessage}
          </p>
          <HeaderReport
            className="tablet:flex hidden"
            stats={stats}
            isPending={isPending}
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
        isPending={isPending}
      />
    </div>
  );
};

export default DashboardHeader;
