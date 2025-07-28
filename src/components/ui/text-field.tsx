'use client';

import React, { useId, useState } from 'react';

import { createContextFactory } from '../../lib/context';
import { cn } from '../../lib/utils';

type TextFieldProps = Omit<
  React.ComponentPropsWithRef<'div'>,
  'onChange' | 'value'
> & {
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: boolean;
  errorMessage?: React.ReactNode;
  required?: boolean;
};

const TextField = ({
  value: externalValue,
  onChange: externalOnChange,
  defaultValue,
  className,
  children,
  label,
  description,
  required,
  error,
  errorMessage,
  ...props
}: TextFieldProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');

  const value = externalValue ?? internalValue;
  const onChange = externalOnChange ?? setInternalValue;

  const textFieldId = useId();
  const descriptionId = useId();
  const errorMessageId = useId();

  const [descriptionElement, setDescriptionElement] =
    useState<HTMLParagraphElement | null>(null);
  const [errorMessageElement, setErrorMessageElement] =
    useState<HTMLParagraphElement | null>(null);

  const contextValue = {
    value,
    onChange,
    defaultValue,
    required,
    error,
    textFieldId,
    descriptionId,
    errorMessageId,
    descriptionElement,
    errorMessageElement,
    setDescriptionElement,
    setErrorMessageElement,
  };

  return (
    <TextFieldContext value={contextValue}>
      <div
        className={cn('flex w-full flex-col', className)}
        {...props}
      >
        {label}
        <div
          className={cn(
            'bg-gray-scale-white border-line-line2 flex h-[56px] gap-6 rounded-[4px] border px-6',
            'focus-within:border-key-color-quaternary',
            'has-data-invalid:focus-within:border-system-warning has-data-invalid:border-system-warning',
            'has-data-disabled:bg-gray-scale-gray-5 has-data-disabled:text-text-inactive has-data-disabled:pointer-events-none'
          )}
        >
          {children}
        </div>
        {(description || (error && errorMessage)) && (
          <div className="mt-2 flex justify-end gap-3">
            <div className="flex-1">
              {description && description}
              {error && errorMessage}
            </div>
          </div>
        )}
      </div>
    </TextFieldContext>
  );
};

type TextFieldInputProps = React.ComponentPropsWithRef<'input'>;

const TextFieldInput = ({ className, ...props }: TextFieldInputProps) => {
  const { register } = useRegisterTextField();

  return (
    <input
      className={cn(
        'text-text-main placeholder-gray-scale-gray-40 w-full text-base outline-hidden',
        className
      )}
      data-disabled={props.disabled}
      data-readonly={props.readOnly}
      {...register}
      {...props}
    />
  );
};

type TextFieldAdornmentProps = React.ComponentPropsWithRef<'div'>;

const TextFieldPrefix = ({
  className,
  children,
  ...props
}: TextFieldAdornmentProps) => {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const TextFieldSuffix = ({
  className,
  children,
  ...props
}: TextFieldAdornmentProps) => {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const TextFieldLabel = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<'label'>) => {
  const { required, textFieldId } = useTextFieldContext();

  return (
    <label
      htmlFor={textFieldId}
      className={cn(
        'mb-2 flex items-center text-[18px] font-semibold',
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-system-warning ml-1 text-[20px]">*</span>
      )}
    </label>
  );
};

type TextFieldDescriptionProps = React.ComponentPropsWithRef<'p'>;

const TextFieldDescription = ({
  className,
  children,
  ...props
}: TextFieldDescriptionProps) => {
  const { descriptionId, setDescriptionElement } = useTextFieldContext();

  const refCallback = (node: HTMLParagraphElement | null) => {
    if (node) {
      setDescriptionElement(node);
    }

    return () => {
      setDescriptionElement(null);
    };
  };

  return (
    <p
      id={descriptionId}
      ref={refCallback}
      className={cn('text-text-sub2 font-label-normal flex-1', className)}
      {...props}
    >
      {children}
    </p>
  );
};

type TextFieldErrorMessageProps = React.ComponentPropsWithRef<'p'>;

const TextFieldErrorMessage = ({
  className,
  children,
  ...props
}: TextFieldErrorMessageProps) => {
  const { errorMessageId, setErrorMessageElement } = useTextFieldContext();

  const refCallback = (node: HTMLParagraphElement | null) => {
    if (node) {
      setErrorMessageElement(node);
    }

    return () => {
      setErrorMessageElement(null);
    };
  };

  return (
    <p
      id={errorMessageId}
      ref={refCallback}
      className={cn('text-system-warning mt-1 flex-1 text-[14px]', className)}
      {...props}
    >
      {children}
    </p>
  );
};

type TextFieldContextValue = {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  maxGraphemeCount?: number;
  required?: boolean;
  error?: boolean;
  textFieldId: string;
  errorMessageId: string;
  descriptionId: string;
  descriptionElement: HTMLParagraphElement | null;
  errorMessageElement: HTMLParagraphElement | null;
  setDescriptionElement: (element: HTMLParagraphElement | null) => void;
  setErrorMessageElement: (element: HTMLParagraphElement | null) => void;
};

const [TextFieldContext, useTextFieldContext] =
  createContextFactory<TextFieldContextValue>('');

const useRegisterTextField = () => {
  const {
    textFieldId,
    value,
    onChange,
    error,
    descriptionElement,
    errorMessageElement,
    errorMessageId,
    descriptionId,
    maxGraphemeCount,
  } = useTextFieldContext();

  const onFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (maxGraphemeCount) {
      const slicedValue = event.target.value.slice(0, maxGraphemeCount);
      return onChange(slicedValue);
    }

    onChange(event.target.value);
  };

  const register = {
    id: textFieldId,
    value,
    onChange: onFieldChange,
    'aria-invalid': error || undefined,
    'data-invalid': error || undefined,
    'aria-describedby': cn(
      descriptionElement && descriptionId,
      errorMessageElement && errorMessageId
    ),
  };

  return { register };
};

TextField.Input = TextFieldInput;
TextField.Prefix = TextFieldPrefix;
TextField.Suffix = TextFieldSuffix;
TextField.Label = TextFieldLabel;
TextField.Description = TextFieldDescription;
TextField.ErrorMessage = TextFieldErrorMessage;

export { TextField };
