'use client';

import type { ComponentType } from 'react';
import { useState } from 'react';

import { useStudentStudyRoomsQuery } from '@/features/study-rooms';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ChatIcon,
  CoiledBookIcon,
  PenIcon,
  UserPlusIcon,
} from '@/shared/components/icons';
import { cn } from '@/shared/lib';

import { useOnboardingStatus } from '../../hooks/use-onboarding-status';
import { OnboardingControlButton } from '../onboarding/onboarding-control-button';
import { OnboardingStep } from '../onboarding/onboarding-step';
import { OnboardingStepGroup } from '../onboarding/onboarding-step-group';

// 학생 온보딩 단계
const ONBOARDING_STEPS = [
  { label: '선생님 초대 받기', icon: UserPlusIcon },
  { label: '수업노트 확인하기', icon: CoiledBookIcon },
  { label: '과제 제출하기', icon: PenIcon },
  { label: '질문하기', icon: ChatIcon },
] as const satisfies readonly {
  label: string;
  icon: ComponentType<{ className?: string }>;
}[];

const StudentOnboarding = () => {
  const { data: studentRooms } = useStudentStudyRoomsQuery();
  const rooms = studentRooms;
  const { hasRooms, hasNotes, hasAssignments, hasQuestions } =
    useOnboardingStatus({ rooms });

  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  const completionStatus = [
    hasRooms,
    hasNotes,
    hasAssignments,
    hasQuestions,
  ] as const;

  const getStepVariant = (index: number): 'completed' | 'incompleted' =>
    completionStatus[index] === true ? 'completed' : 'incompleted';

  // 선생님 초대 받기 완료 여부 - 타이틀 변경, 닫기 가능 여부 결정
  const isInviteCompleted = hasRooms === true;

  if (!isVisible) return null;

  const titleClassName =
    'font-body1-heading tablet:font-headline1-heading text-orange-12 text-balance';

  return (
    <div className={cn('bg-orange-scale-orange-1 rounded-2xl p-8')}>
      <div className="flex w-full items-center justify-between gap-2 text-left">
        {isInviteCompleted ? (
          <span className={titleClassName}>
            이제 디에듀의 다양한 기능을 이용해보세요!
          </span>
        ) : (
          <span className={titleClassName}>
            선생님으로부터 초대를 받아
            <br className="tablet:hidden" />
            스터디룸에 참여해주세요
          </span>
        )}
        <OnboardingControlButton
          canClose={isInviteCompleted}
          isExpanded={isExpanded}
          onClose={() => setIsVisible(false)}
          onExpandToggle={() => setIsExpanded((prev) => !prev)}
        />
      </div>

      <div
        className={cn(
          'mt-4 flex gap-2',
          'tablet:flex-row tablet:flex-wrap tablet:items-center flex-col',
          !isExpanded && 'tablet:flex hidden'
        )}
      >
        <OnboardingStep
          icon={ONBOARDING_STEPS[0].icon}
          label={ONBOARDING_STEPS[0].label}
          variant={getStepVariant(0)}
        />
        <div className="tablet:contents flex justify-center py-1">
          <ArrowDownIcon className="text-orange-4 tablet:hidden" />
          <ArrowRightIcon className="text-orange-4 tablet:block hidden" />
        </div>
        <OnboardingStep
          icon={ONBOARDING_STEPS[1].icon}
          label={ONBOARDING_STEPS[1].label}
          variant={getStepVariant(1)}
        />
        <div className="tablet:contents flex justify-center py-1">
          <ArrowDownIcon className="text-orange-4 tablet:hidden" />
          <ArrowRightIcon className="text-orange-4 tablet:block hidden" />
        </div>
        <OnboardingStepGroup className="tablet:flex-row flex-col">
          {ONBOARDING_STEPS.slice(2).map((step, index) => (
            <OnboardingStep
              key={step.label}
              icon={step.icon}
              label={step.label}
              variant={getStepVariant(index + 2)}
              grouped
            />
          ))}
        </OnboardingStepGroup>
      </div>
    </div>
  );
};

export default StudentOnboarding;
