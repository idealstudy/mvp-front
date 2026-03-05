'use client';

import React, { useEffect, useRef } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import step2 from '@/features/study-rooms/data/step2.json';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { RadioCard } from '@/shared/components/ui/radio-card';
import { RadioGroup } from '@/shared/components/ui/radio-group';
import { Select } from '@/shared/components/ui/select';

type Base = {
  id: string;
  name: string;
  title: string;
  type: 'radio' | 'select';
  required?: string;
};

type Option = {
  value: string;
  label: string;
  subLabel?: string;
};

type RadioQuestion = Base & {
  type: 'radio';
  options: Option[];
};

type SelectQuestion = Base & {
  type: 'select';
  options: {
    school: Option[];
    grade: Option[];
  };
};

type Data = RadioQuestion | SelectQuestion;

type FileSchema = {
  data: Data[];
};

const { data } = step2 as FileSchema;

export default function StepTwo({
  disabled,
  onRequestSubmit,
  onRequestEdit,
  onCancel,
  mode,
}: {
  disabled?: boolean;
  onRequestSubmit?: () => void;
  onRequestEdit?: () => void;
  onCancel?: () => void;
  mode: 'edit' | 'create';
}) {
  const {
    control,
    getValues,
    setValue,

    formState: { isValid, isDirty },
  } = useFormContext();
  const title = getValues('basic.title') ?? '';
  const school = useWatch({ control, name: 'schoolInfo.schoolLevel' });
  const prevSchoolRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (prevSchoolRef.current === undefined) {
      prevSchoolRef.current = school;
      return;
    }

    if (prevSchoolRef.current !== school) {
      setValue('schoolInfo.grade', undefined, { shouldValidate: true });
    }

    prevSchoolRef.current = school;
  }, [school, setValue]);

  return (
    <>
      {data.map((el) => {
        return (
          <React.Fragment key={el.id}>
            <div className="text-2xl font-semibold">
              <p>{el.id.toUpperCase()}</p>
              <p>{el.id === 'q1' ? title + el.title : el.title}</p>
            </div>

            {el.type === 'radio' && (
              <Controller
                name={el.name}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    name={field.name}
                    className="my-6 w-full flex-row"
                  >
                    {el.options.map((option) => (
                      <RadioCard.Item
                        key={option.value}
                        value={option.value}
                        className={`border-line-line2 flex h-32 flex-1 cursor-pointer items-center justify-center ${field.value === option.value ? 'border-key-color-primary bg-key-color-primary/10 text-key-color-primary' : ''} `}
                      >
                        <div className="text-center">
                          <p className="font-medium">{option.label}</p>
                          {option.subLabel && (
                            <p
                              className={`text-sm text-gray-500 ${field.value === option.value ? 'text-key-color-primary' : ''}`}
                            >
                              {option.subLabel}
                            </p>
                          )}
                        </div>
                      </RadioCard.Item>
                    ))}
                  </RadioGroup>
                )}
              />
            )}

            {el.type === 'select' && (
              <div className="max-desktop:flex-col my-6 flex gap-3">
                <Form.Item>
                  <Controller
                    name="schoolInfo.schoolLevel"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        name={field.name}
                        onValueChange={field.onChange}
                      >
                        <Select.Trigger
                          placeholder="학교를 선택하세요"
                          className="max-desktop:w-full w-[240px]"
                        />
                        <Select.Content>
                          {el.options.school.map((option) => (
                            <Select.Option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </Select.Option>
                          ))}
                        </Select.Content>
                      </Select>
                    )}
                  />
                </Form.Item>

                <Form.Item>
                  <Controller
                    name="schoolInfo.grade"
                    control={control}
                    rules={{ required: school !== 'OTHER' }}
                    render={({ field }) => (
                      <Select
                        value={field.value != null ? String(field.value) : ''}
                        name={field.name}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <Select.Trigger
                          placeholder="학년을 선택하세요"
                          disabled={!school || school === 'OTHER'}
                          className="max-desktop:w-full w-[240px]"
                        />
                        <Select.Content>
                          {el.options.grade
                            .filter((option) => {
                              if (school === 'ELEMENTARY') return true;
                              return Number(option.value) <= 3;
                            })
                            .map((option) => (
                              <Select.Option
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </Select.Option>
                            ))}
                        </Select.Content>
                      </Select>
                    )}
                  />
                </Form.Item>
              </div>
            )}
          </React.Fragment>
        );
      })}

      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground bg-key-color-secondary text-text-sub2 rounded-md p-2 text-sm">
          작성하신 정보는 더 나은 디에듀 서비스를 제공하는데에 활용됩니다.
        </p>
        {mode === 'edit' ? (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              className="max-desktop:w-full text-orange-7 border-orange-7 hover:bg-orange-7/10 w-48 self-end bg-white"
              onClick={onCancel}
            >
              취소
            </Button>
            <Button
              type="button"
              className="max-desktop:w-full w-48 self-end"
              disabled={disabled || !isValid || !isDirty}
              onClick={onRequestEdit}
            >
              {disabled ? '수정 중...' : '수정하기'}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            className="max-desktop:w-full w-48 self-end"
            disabled={disabled || !isValid}
            onClick={onRequestSubmit}
          >
            {disabled ? '생성 중...' : '완료'}
          </Button>
        )}
      </div>
    </>
  );
}
