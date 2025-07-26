'use client';

import { Controller, useFormContext } from 'react-hook-form';

import Image from 'next/image';

import { Checkbox } from '@/components/ui/checkbox';
import { Form } from '@/components/ui/form';
import { Select } from '@/components/ui/select';

import { StudyNoteForm } from '../schemas/note';
import { RequiredMark } from './form-provider';

const VisiblitySection = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<StudyNoteForm>();

  const visibility = watch('visibility');
  const showParentOnly =
    visibility === 'SPECIFIC_STUDENTS_AND_PARENTS' ||
    visibility === 'SPECIFIC_STUDENTS_ONLY';

  return (
    <Form.Item error={!!errors.visibility}>
      <Form.Label>
        공개 범위
        <RequiredMark />
      </Form.Label>
      <Form.Control>
        <div className="flex gap-x-5">
          <Controller
            name="visibility"
            control={control}
            rules={{ required: '공개 범위를 선택해주세요.' }}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);

                  // visibility가 바뀌면 조건에 맞지 않으면 parentOnly false 초기화
                  const shouldShowParentOnly =
                    val === 'SPECIFIC_STUDENTS_AND_PARENTS' ||
                    val === 'SPECIFIC_STUDENTS_ONLY';

                  if (!shouldShowParentOnly) {
                    setValue('parentOnly', false);
                  }
                }}
              >
                <Select.Trigger
                  placeholder="범위를 선택하세요"
                  className="w-1/2"
                />
                <Select.Content>
                  <Select.Option value="TEACHER_ONLY">나만 보기</Select.Option>
                  <Select.Option value="SPECIFIC_STUDENTS_ONLY">
                    수업 대상 학생
                  </Select.Option>
                  <Select.Option value="SPECIFIC_STUDENTS_AND_PARENTS">
                    스터디 룸
                  </Select.Option>
                  <Select.Option value="PUBLIC">전체 공개</Select.Option>
                </Select.Content>
              </Select>
            )}
          />

          {showParentOnly && (
            <Controller
              name="parentOnly"
              control={control}
              render={({ field }) => (
                <Checkbox.Label
                  htmlFor="parentOnly"
                  className="gap-x-2"
                >
                  <Checkbox
                    id="parentOnly"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  보호자에게 공개
                </Checkbox.Label>
              )}
            />
          )}
        </div>
      </Form.Control>

      {errors.visibility && (
        <Form.ErrorMessage className="text-system-warning text-sm">
          {errors.visibility.message}
        </Form.ErrorMessage>
      )}

      {showParentOnly && (
        <Form.Description className="text-text-sub2 flex gap-x-[3px] text-sm">
          <Image
            src="/common/info.svg"
            alt="info-svg"
            width={16}
            height={16}
          />
          {
            "'보호자 공개' 선택시, 수업 대상 학생과 연결된 보호자도 이 수업노트를 볼 수 있습니다."
          }
        </Form.Description>
      )}
    </Form.Item>
  );
};

export default VisiblitySection;
