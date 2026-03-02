'use client';

import React from 'react';

import { DashboardCompleted } from '@/features/dashboard/components/completed';
import { DashboardOnboarding } from '@/features/dashboard/components/onboarding';
import { useTeacherOnboardingQuery } from '@/features/dashboard/hooks/use-onboarding-query';
import { useOnboardingStatus } from '@/features/dashboard/hooks/use-onboarding-status';
import { useInviteTokenHandler } from '@/features/invite/hooks';
import { useStudentStudyRoomsQuery } from '@/features/study-rooms';
import { trackPageView } from '@/shared/lib/gtm/trackers';
import { useMemberStore } from '@/store';

import DashboardTeacher from './teacher';

export const DashboardContainer = () => {
  useInviteTokenHandler();

  const session = useMemberStore((s) => s.member);
  const role = session?.role;
  const isTeacher = role === 'ROLE_TEACHER';

  // 강사 온보딩 조회
  const { data: teacherOnboarding, isLoading: isLoadingTeacher } =
    useTeacherOnboardingQuery({ enabled: isTeacher });
  // 학생 온보딩 완료 확인을 위한 study rooms 조회
  const { data: studentRooms, isLoading: isLoadingStudent } =
    useStudentStudyRoomsQuery({
      enabled: !isTeacher,
    });

  // 역할에 따른 rooms 데이터
  const rooms = isTeacher ? undefined : studentRooms;
  // 로딩 중 여부
  const isLoading = isTeacher ? isLoadingTeacher : isLoadingStudent;

  React.useEffect(() => {
    // 대시보드 페이지뷰 이벤트
    trackPageView('dashboard', {}, role ?? null);
  }, [role]);

  // 온보딩 완료 여부 체크 (스터디룸 존재 여부만 확인)
  // TODO: 전체 조회 API가 생기면 상세 체크하도록 변경
  const { hasRooms, hasNotes, hasAssignments, hasQuestions } =
    useOnboardingStatus({ rooms });

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="bg-system-background">
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-center px-6 pt-12 pb-24">
          <div className="text-text-sub2 text-center">로딩 중...</div>
        </div>
      </div>
    );
  }

  // 온보딩 완료 여부 판단
  // 강사: 스터디룸, 학생 초대, 수업노트, 과제, 피드백 - query로 조회
  // 학생: 스터디룸 참여, 수업노트 확인, 과제 제출, 질문 (피드백 제외) - hook으로 조회
  const teacherAllStepsCompleted = teacherOnboarding?.isCompleted;
  const studentStepsCompleted = [
    hasRooms, // 선생님 초대 받기
    hasNotes, // 수업노트 확인하기
    hasAssignments, // 과제 제출하기
    hasQuestions, // 질문하기
    // 학생은 피드백 받는 것은 온보딩 단계가 아님
  ];

  const allStepsCompleted = isTeacher
    ? teacherAllStepsCompleted
    : studentStepsCompleted.every((completed) => completed);

  // 온보딩 완료 여부에 따라 다른 화면 표시
  if (!role) {
    return null; // 역할이 없으면 아무것도 표시하지 않음
  }

  // 강사 대시보드 표시
  if (isTeacher) {
    return <DashboardTeacher />;
  }

  // 온보딩 완료: 축하 화면 표시
  if (allStepsCompleted) {
    return <DashboardCompleted role={role} />;
  }

  // 온보딩 진행 중: 온보딩 화면 표시
  return <DashboardOnboarding role={role} />;
};
