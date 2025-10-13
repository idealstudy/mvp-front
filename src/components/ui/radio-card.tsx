'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { Label, RadioGroup as RadioGroupPrimitives } from 'radix-ui';

/**
 * RadioCard 컴포넌트
 * - <RadioGroup> 내부에서만 사용해야 함 (Radix UI RadioGroup 컨텍스트 필요)
 * - <RadioCard.Item> : 카드형 라디오 아이템. 라벨(label) 전체가 클릭 타깃이 됨
 * - <RadioCard.Label> : Radix의 Label.Root 래퍼 (내부적으로 Item에서 사용)
 * - 스타일 상태는 Radix data-attribute 로 제어됨
 *    - data-[state=checked] : 선택됨
 *    - data-[disabled]      : 비활성화
 *
 * 주의사함
 * - <RadioCard> 자체는 Root가 아님 → 단독 사용 불가
 * - 카드 내부에는 button, input 같은 interactive 요소를 직접 넣지 말 것 (label 안에 label 충돌 발생 가능)
 **/
type RadioCardProps = React.ComponentPropsWithoutRef<typeof Label.Root> & {
  value: string;
  disabled?: boolean;
};

// TODO: disabled 상태일 때 커서 처리 개선 필요
// 현재는 disabled 속성만으로 선택 불가 처리가 되지만
// UX 관점에서 금지 커서(cursor-not-allowed)를 함께 표시하는 것이 적절함
// 단순히 pointer-events-none을 쓰면 금지 커서까지 사라져
// 사용자 입장에서 "왜 클릭이 안 되지?"라는 혼동이 생길 수 있음
// 따라서 스타일 레벨에서 data-[disabled]:cursor-not-allowed 적용 검토
// 제어형(onValueChange) 사용 시에는 disabled 값 무시 로직도 함께 필요
const RadioCardItem = ({
  value,
  disabled,
  className,
  children,
  ...props
}: RadioCardProps) => {
  return (
    <RadioGroupPrimitives.Item
      value={value}
      disabled={disabled}
      asChild
    >
      <RadioCardLabel
        className={className}
        {...props}
      >
        {children}
      </RadioCardLabel>
    </RadioGroupPrimitives.Item>
  );
};

const RadioCardLabel = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<'label'>) => {
  return (
    <Label.Root
      className={cn(
        'block cursor-pointer rounded-md border p-4 transition',
        'data-[state=checked]:border-key-color-primary data-[state=checked]:shadow',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        //'data-[disabled]:pointer-events-none',
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className
      )}
      {...props}
    >
      {children}
    </Label.Root>
  );
};

export const RadioCard = {
  Item: RadioCardItem,
  Label: RadioCardLabel,
};
