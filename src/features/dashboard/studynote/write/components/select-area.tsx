'use client';

import { Controller, useFormContext } from 'react-hook-form';

import Image from 'next/image';

import { ColumnLayout } from '@/components/layout/column-layout';
import { Form } from '@/components/ui/form';
import { Select } from '@/components/ui/select';

import { StudyNoteForm } from '../schemas/note';
import { useStudyRoomsQuery } from '../services/query';

const SelectArea = () => {
  const { data: rooms } = useStudyRoomsQuery();

  const {
    control,
    formState: { errors },
  } = useFormContext<StudyNoteForm>();

  return (
    <ColumnLayout.Left className="border-line-line1 h-fit rounded-xl border bg-white px-8 py-10">
      <Image
        src="/dashboard/study-room-profile.png"
        alt="select-area"
        width={300}
        height={300}
      />
      <div className="my-10 flex items-center justify-between">
        <span className="text-2xl leading-[140%] font-bold">
          스터디룸을 선택해주세요.
        </span>
      </div>

      <Form.Item error={!!errors.title}>
        <Form.Label className="text-text-sub2 text-base font-semibold">
          수업노트 그룹
        </Form.Label>
        <Form.Control>
          <Controller
            name="studyRoomId"
            control={control}
            rules={{ required: '공개 범위를 선택해주세요.' }}
            render={({ field }) => (
              <Select
                value={String(field.value) || ''}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <Select.Trigger
                  placeholder="없음"
                  className="mt-[9px]"
                />
                <Select.Content>
                  {rooms?.map((room) => (
                    <Select.Option
                      key={room.id}
                      value={room.id + ''}
                    >
                      {room.name}
                    </Select.Option>
                  ))}
                </Select.Content>
              </Select>
            )}
          />
        </Form.Control>
      </Form.Item>
    </ColumnLayout.Left>
  );
};

export default SelectArea;
