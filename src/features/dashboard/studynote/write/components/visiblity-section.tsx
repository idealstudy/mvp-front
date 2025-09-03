'use client';

import { Controller, useFormContext } from 'react-hook-form';

import Image from 'next/image';

import { Checkbox } from '@/components/ui/checkbox';
import { Form } from '@/components/ui/form';
import { Select } from '@/components/ui/select';
import { STUDY_NOTE_VISIBILITY } from '@/features/dashboard/studynote/constant';

import { StudyNoteForm } from '../schemas/note';
import { useWriteStudyNoteMutation } from '../services/query';
import { RequiredMark } from './form-provider';

const VisibilitySection = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<StudyNoteForm>();

  const visibility = watch('visibility');
  const { isPending } = useWriteStudyNoteMutation();

  const isGuardianSelectable = isGuardianVisibilityAllowed(visibility);

  const handleVisibilityChange = (val: string) => {
    if (!isGuardianVisibilityAllowed(val)) {
      setValue('isGuardianVisible', false);
    }
  };

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
                disabled={isPending}
                onValueChange={(val) => {
                  field.onChange(val);
                  handleVisibilityChange(val);
                }}
              >
                <Select.Trigger
                  placeholder="범위를 선택하세요"
                  className="w-1/2"
                />
                <Select.Content>
                  <Select.Option value={STUDY_NOTE_VISIBILITY.TEACHER_ONLY}>
                    나만 보기
                  </Select.Option>
                  <Select.Option
                    value={STUDY_NOTE_VISIBILITY.SPECIFIC_STUDENTS_ONLY}
                  >
                    수업 대상 학생
                  </Select.Option>
                  <Select.Option
                    value={STUDY_NOTE_VISIBILITY.STUDY_ROOM_STUDENTS_ONLY}
                  >
                    스터디 룸
                  </Select.Option>
                  <Select.Option value={STUDY_NOTE_VISIBILITY.PUBLIC}>
                    전체 공개
                  </Select.Option>
                </Select.Content>
              </Select>
            )}
          />

          {isGuardianSelectable && (
            <Controller
              name="isGuardianVisible"
              control={control}
              render={({ field }) => (
                <Checkbox.Label
                  htmlFor="guardian-visible"
                  className="gap-x-1"
                >
                  <Checkbox
                    id="guardian-visible"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
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

      {isGuardianSelectable && (
        <Form.Description className="text-text-sub2 flex gap-x-[3px] text-sm">
          <Image
            src="/common/info.svg"
            alt="info-icon"
            width={16}
            height={16}
          />
          보호자 공개 선택 시, 수업 대상 학생과 연결된 보호자도 이 수업노트를 볼
          수 있습니다.
        </Form.Description>
      )}
    </Form.Item>
  );
};

export default VisibilitySection;

function isGuardianVisibilityAllowed(visibility: string): boolean {
  return (
    visibility === STUDY_NOTE_VISIBILITY.SPECIFIC_STUDENTS_ONLY ||
    visibility === STUDY_NOTE_VISIBILITY.STUDY_ROOM_STUDENTS_ONLY
  );
}
