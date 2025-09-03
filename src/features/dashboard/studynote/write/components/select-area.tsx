'use client';

import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Image from 'next/image';

import { ColumnLayout } from '@/components/layout/column-layout';
import { Form } from '@/components/ui/form';
import { ChevronDownIcon, Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Popover } from 'radix-ui';

import { StudyNoteForm } from '../schemas/note';
import { useStudyNoteGroupsQuery, useStudyRoomsQuery } from '../services/query';

const SelectArea = () => {
  const { data: rooms } = useStudyRoomsQuery();
  const { data: studyNoteGroups } = useStudyNoteGroupsQuery();

  const [open, setOpen] = useState(false);

  const {
    control,
    formState: { errors },
  } = useFormContext<StudyNoteForm>();

  return (
    <ColumnLayout.Left className="border-line-line1 h-fit rounded-xl border bg-white px-8 py-10">
      <Image
        src="/studyroom/study-room-profile.svg"
        alt="select-area"
        width={300}
        height={300}
      />
      <div className="my-10 flex w-full items-center justify-between">
        <Form.Item
          error={!!errors.studyRoomId}
          className="w-full"
        >
          <Form.Control>
            <Controller
              name="studyRoomId"
              control={control}
              render={({ field }) => {
                return (
                  <Popover.Root
                    open={open}
                    onOpenChange={setOpen}
                  >
                    <Popover.Trigger asChild>
                      <button className="flex w-full cursor-pointer items-center justify-between text-start text-2xl leading-[140%] font-bold">
                        <span>
                          {field.value
                            ? rooms?.find((room) => room.id === field.value)
                                ?.name || '스터디룸을 선택해주세요.'
                            : '스터디룸을 선택해주세요.'}
                        </span>
                        <ChevronDownIcon
                          className={cn(
                            'h-6 w-6 transition-transform duration-200',
                            open ? 'rotate-180' : ''
                          )}
                        />
                      </button>
                    </Popover.Trigger>

                    <Popover.Portal>
                      <Popover.Content
                        className="mt-1 rounded-md border border-gray-200 bg-white shadow-sm"
                        style={{ width: 'var(--radix-popover-trigger-width)' }}
                      >
                        {rooms?.map((room) => (
                          <Popover.Close
                            key={room.id}
                            onClick={() => {
                              field.onChange(room.id);
                              setOpen(false);
                            }}
                            className={cn(
                              'w-full cursor-pointer px-4 py-2 text-left transition-colors hover:bg-gray-100',
                              field.value === room.id &&
                                'bg-gray-200 font-semibold'
                            )}
                          >
                            {room.name}
                          </Popover.Close>
                        ))}
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                );
              }}
            />
          </Form.Control>
          {errors.studyRoomId && (
            <Form.ErrorMessage className="text-system-warning text-sm">
              {errors.studyRoomId.message}
            </Form.ErrorMessage>
          )}
        </Form.Item>
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
                  {studyNoteGroups?.content.map((group) => (
                    <Select.Option
                      key={group.id}
                      value={group.id + ''}
                    >
                      {group.title}
                    </Select.Option>
                  ))}
                </Select.Content>
              </Select>
            )}
          />
        </Form.Control>
        {errors.studyRoomId && (
          <Form.ErrorMessage className="text-system-warning text-sm">
            {errors.studyRoomId.message}
          </Form.ErrorMessage>
        )}
      </Form.Item>
    </ColumnLayout.Left>
  );
};

export default SelectArea;
