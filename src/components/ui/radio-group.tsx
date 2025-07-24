'use client';

import React, { useId } from 'react';

import { createContextFactory } from '@/lib/context';
import { cn } from '@/lib/utils';
import { Label, RadioGroup as RadioGroupPrimitives } from 'radix-ui';

type RadioGroupProps = RadioGroupPrimitives.RadioGroupProps;

const RadioGroup = ({
  className,
  children,
  ['aria-invalid']: ariaInvalid,
  ...props
}: RadioGroupProps) => {
  return (
    <RadioGroupContext value={{ ariaInvalid }}>
      <RadioGroupPrimitives.Root
        className={cn('flex flex-col items-center gap-3', className)}
        {...props}
      >
        {children}
      </RadioGroupPrimitives.Root>
    </RadioGroupContext>
  );
};

type RadioGroupItemProps = React.ComponentPropsWithRef<
  typeof RadioGroupPrimitives.Item
>;

const RadioGroupItem = ({ className, ...props }: RadioGroupItemProps) => {
  const id = useId();
  const { ariaInvalid } = useRadioGroupContext();

  return (
    <RadioGroupPrimitives.Item
      id={id}
      className={cn(
        'border-line-line3 flex size-[24px] cursor-pointer items-center justify-center rounded-full border',
        'disabled:border-line-line2',
        ariaInvalid && '',

        className
      )}
      {...props}
    >
      <RadioGroupPrimitives.Indicator
        className={cn(
          'bg-key-color-primary size-[12px] rounded-full',
          'data-disabled:bg-gray-scale-gray-20'
        )}
      />
    </RadioGroupPrimitives.Item>
  );
};

const RadioGroupLabel = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<'label'>) => {
  return (
    <Label.Root
      className={cn('', className)}
      {...props}
    >
      {children}
    </Label.Root>
  );
};

type RadioGroupOptionProps = RadioGroupItemProps;

const RadioGroupOption = ({
  className,
  children,
  ...props
}: RadioGroupOptionProps) => {
  const id = useId();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <RadioGroupItem
        id={id}
        {...props}
      />
      <RadioGroupLabel htmlFor={id}>{children}</RadioGroupLabel>
    </div>
  );
};

RadioGroup.Item = RadioGroupItem;
RadioGroup.Option = RadioGroupOption;

type RadioGroupContextValue = {
  ariaInvalid?: boolean | 'true' | 'false' | 'grammar' | 'spelling' | undefined;
};

const [RadioGroupContext, useRadioGroupContext] =
  createContextFactory<RadioGroupContextValue>('RadioGroup');

export { RadioGroup };
