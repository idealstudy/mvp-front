// TODO: 작업중
// https://github.com/radix-ui/primitives/blob/main/packages/react/accordion/src/accordion.tsx
// https://www.radix-ui.com/primitives/docs/components/accordion
'use client';

import { ForwardRefExoticComponent, RefAttributes, forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/shared/lib';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import {
  AccordionMultipleProps,
  AccordionSingleProps,
} from '@radix-ui/react-accordion';

import { Icon } from './icon';

// TODO: 작업중
// https://github.com/radix-ui/primitives/blob/main/packages/react/accordion/src/accordion.tsx
// https://www.radix-ui.com/primitives/docs/components/accordion

// TODO: 작업중
// https://github.com/radix-ui/primitives/blob/main/packages/react/accordion/src/accordion.tsx
// https://www.radix-ui.com/primitives/docs/components/accordion

// TODO: 작업중
// https://github.com/radix-ui/primitives/blob/main/packages/react/accordion/src/accordion.tsx
// https://www.radix-ui.com/primitives/docs/components/accordion

/* ─────────────────────────────────────────────────────
 * Accordion Type
 * ────────────────────────────────────────────────────*/
type AccordionRootType = ForwardRefExoticComponent<
  (AccordionSingleProps | AccordionMultipleProps) &
    RefAttributes<HTMLDivElement>
>;

type ExtendedAccordionComponent = AccordionRootType & {
  Item: typeof AccordionItem;
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
};

/* ─────────────────────────────────────────────────────
 * Accordion Component
 * ────────────────────────────────────────────────────*/
const Accordion = AccordionPrimitive.Root as ExtendedAccordionComponent;

/* ─────────────────────────────────────────────────────
 * AccordionItem
 * ────────────────────────────────────────────────────*/
const AccordionItem = forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      'border-line-line1/70 rounded-2xl border bg-white/5 backdrop-blur-sm',
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

/* ─────────────────────────────────────────────────────
 * AccordionTrigger
 * ────────────────────────────────────────────────────*/
const AccordionTrigger = forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left text-base font-semibold transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 [&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      <span className="flex flex-col gap-1">{children}</span>
      <Icon.ChevronDown
        aria-hidden
        className="shrink-0 transition-transform"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

/* ─────────────────────────────────────────────────────
 * AccordionContent
 * ────────────────────────────────────────────────────*/
const AccordionContent = forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      // data-[state=closed]:max-h-0 data-[state=open]:max-h-[440px]
      // 이 부분은 Radix의 Collapsible Content 애니메이션 (높이 조정)을 위한 CSS 변환 속성으로 대체하는 것이 더 좋습니다.
      'data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown overflow-hidden text-sm transition-all',
      className
    )}
    {...props}
  >
    <div className="px-5 pt-0 pb-5 text-sm leading-[160%] text-white/85">
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

export { Accordion };
