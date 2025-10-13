'use client';

import React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { RadioCard } from '@/components/ui/radio-card';
import { RadioGroup } from '@/components/ui/radio-group';
import { Select } from '@/components/ui/select';
import step2 from '@/features/studyrooms/data/step2.json';
import { CreateStepForm } from '@/features/studyrooms/types';

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

export default function StepTwo({ onNext, disabled }: CreateStepForm) {
  const { control, getValues, setValue } = useFormContext();
  const title = getValues('basic.title') ?? '';
  const school = useWatch({ control, name: 'schoolInfo.schoolLevel' });

  React.useEffect(() => {
    setValue('schoolInfo.grade', '', { shouldValidate: true });
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
                        className="border-line-line2 flex h-32 flex-1 items-center justify-center"
                      >
                        <div className="text-center">
                          <p className="font-medium">{option.label}</p>
                          {option.subLabel && (
                            <p className="text-sm text-gray-500">
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
              <div className="my-6 flex gap-3">
                <Form.Item>
                  <Controller
                    name="schoolInfo.schoolLevel"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        name={field.name}
                        onValueChange={field.onChange}
                      >
                        <Select.Trigger
                          placeholder="학교를 선택하세요"
                          className="w-[240px]"
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
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        name={field.name}
                        onValueChange={field.onChange}
                      >
                        <Select.Trigger
                          placeholder="학년을 선택하세요"
                          className="w-[240px]"
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

      <div className="flex items-center justify-between space-y-4">
        <p className="text-muted-foreground bg-key-color-secondary text-text-sub2 rounded-md p-2 text-sm">
          작성하신 정보는 더 나은 디에듀 서비스를 제공하는데에 활용됩니다.
        </p>
        <Button
          type="button"
          className="w-48"
          onClick={onNext}
          disabled={disabled}
        >
          다음
        </Button>
      </div>
    </>
  );
}
