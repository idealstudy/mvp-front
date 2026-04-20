import type { ComponentType } from 'react';
import { useState } from 'react';

import type { TeacherOnboardingStepType } from '@/entities/onboarding';
import { useTeacherOnboardingQuery } from '@/features/dashboard/hooks/use-onboarding-query';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ChatIcon,
  CoiledBookIcon,
  PenIcon,
  RoomIcon,
  UserPlusIcon,
} from '@/shared/components/icons';
import { cn } from '@/shared/lib';

import { OnboardingControlButton } from '../onboarding/onboarding-control-button';
import { OnboardingStep } from '../onboarding/onboarding-step';
import { OnboardingStepGroup } from '../onboarding/onboarding-step-group';

// 강사 온보딩 단계
const ONBOARDING_STEPS = [
  { type: 'CREATE_STUDY_ROOM', label: '스터디룸 생성', icon: RoomIcon },
  { type: 'INVITE_STUDENT', label: '학생 초대', icon: UserPlusIcon },
  { type: 'CREATE_CLASS_NOTE', label: '수업노트 작성', icon: CoiledBookIcon },
  { type: 'GIVE_FEEDBACK', label: '질문 답변', icon: ChatIcon },
  { type: 'ASSIGN_ASSIGNMENT', label: '과제 생성', icon: PenIcon },
] as const satisfies readonly {
  type: TeacherOnboardingStepType;
  label: string;
  icon: ComponentType<{ className?: string }>;
}[];

const TeacherOnboarding = () => {
  const { data: onboarding } = useTeacherOnboardingQuery();
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  const getStepVariant = (stepType: TeacherOnboardingStepType) => {
    const stepStatus = onboarding?.steps?.[stepType]?.status;
    return stepStatus === 'completed' ? stepStatus : 'incompleted';
  };

  // 학생 초대 완료 여부 - 타이틀 변경, 닫기 가능 여부 결정
  const isInviteStudentCompleted =
    getStepVariant('INVITE_STUDENT') === 'completed';

  if (!isVisible) return null;

  const titleClassName =
    'font-body1-heading tablet:font-headline1-heading text-orange-12 text-balance';

  return (
    <div
      className={cn('bg-orange-scale-orange-1 rounded-2xl p-8')}
      data-testid="teacher-onboarding"
    >
      <div className="flex w-full items-center justify-between gap-2 text-left">
        {isInviteStudentCompleted ? (
          <span className={titleClassName}>
            이제 디에듀의 다양한 기능을 이용해보세요!
          </span>
        ) : (
          <span className={titleClassName}>
            먼저 나만의 스터디룸을 생성하고 <br className="tablet:hidden" />
            학생을 초대해주세요
          </span>
        )}
        <OnboardingControlButton
          canClose={isInviteStudentCompleted}
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
          variant={getStepVariant(ONBOARDING_STEPS[0].type)}
        />
        <div className="tablet:contents flex justify-center py-1">
          <ArrowDownIcon className="text-orange-4 tablet:hidden" />
          <ArrowRightIcon className="text-orange-4 tablet:block hidden" />
        </div>
        <OnboardingStep
          icon={ONBOARDING_STEPS[1].icon}
          label={ONBOARDING_STEPS[1].label}
          variant={getStepVariant(ONBOARDING_STEPS[1].type)}
        />
        <div className="tablet:contents flex justify-center py-1">
          <ArrowDownIcon className="text-orange-4 tablet:hidden" />
          <ArrowRightIcon className="text-orange-4 tablet:block hidden" />
        </div>
        <OnboardingStepGroup className="tablet:flex-row flex-col">
          {ONBOARDING_STEPS.slice(2).map((step) => (
            <OnboardingStep
              key={step.type}
              icon={step.icon}
              label={step.label}
              variant={getStepVariant(step.type)}
              grouped
            />
          ))}
        </OnboardingStepGroup>
      </div>
    </div>
  );
};

export default TeacherOnboarding;
