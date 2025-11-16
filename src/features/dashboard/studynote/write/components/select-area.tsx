'use client';

import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Image from 'next/image';

import { ColumnLayout } from '@/layout/column-layout';
import { Form } from '@/shared/components/ui/form';
import {
  ChevronDownIcon,
  PlusIcon,
  Select,
} from '@/shared/components/ui/select';
import { cn } from '@/shared/lib/utils';
import { Popover } from 'radix-ui';

import { StudyNoteForm } from '../schemas/note';
import { useStudyNoteGroupsQuery, useStudyRoomsQuery } from '../services/query';
import { AddGroupDialog } from './add-group-dialog';

const SelectArea = () => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<StudyNoteForm>();
  const roomId = watch('studyRoomId');
  const { data: rooms } = useStudyRoomsQuery();
  const { data: studyNoteGroups } = useStudyNoteGroupsQuery(roomId);
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);

  // useEffect(() => {
  //   const givenRoomId = sessionStorage.getItem('studyroom-id');
  //   if (givenRoomId) setValue('studyRoomId', Number(givenRoomId));
  //   sessionStorage.removeItem('studyroom-id');
  // }, [setValue]);

  return (
    <ColumnLayout.Left className="border-line-line1 h-fit rounded-xl border bg-white px-8 py-10">
      <Image
        src="/studyroom/profile.svg"
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
                // TODO: 진입 시점 파악 필요
                // roomId 제공된 경우 vs 아닌 경우로 나누기
                const fieldValue =
                  field.value != null ? String(field.value) : '';
                const selectedRoomName =
                  rooms?.find((r) => String(r.id) === fieldValue)?.name ??
                  '스터디룸을 선택해주세요.';
                return (
                  <Popover.Root
                    open={open}
                    onOpenChange={setOpen}
                  >
                    <Popover.Trigger asChild>
                      <button
                        type="button"
                        className="flex w-full cursor-pointer items-center justify-between text-start text-2xl leading-[140%] font-bold"
                      >
                        <span>{selectedRoomName}</span>
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
                        {rooms?.map((room) => {
                          const isSelected = fieldValue === String(room.id);

                          return (
                            <Popover.Close
                              key={room.id}
                              asChild
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  field.onChange(room.id);
                                  setOpen(false);
                                }}
                                className={cn(
                                  'w-full cursor-pointer px-4 py-2 text-left transition-colors hover:bg-gray-100',
                                  isSelected && 'bg-gray-200 font-semibold'
                                )}
                              >
                                {room.name}
                              </button>
                            </Popover.Close>
                          );
                        })}
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
            name="teachingNoteGroupId"
            control={control}
            rules={{ required: '공개 범위를 선택해주세요.' }}
            render={({ field }) => {
              const value =
                field.value == null ? undefined : String(field.value);
              return (
                <Select
                  defaultValue=""
                  value={value}
                  onValueChange={(v) => {
                    if (v === 'add') {
                      setOpenGroup(true);
                      return;
                    }
                    field.onChange(Number(v));
                  }}
                >
                  <Select.Trigger
                    placeholder="없음"
                    className="mt-[9px]"
                  />
                  <Select.Content>
                    {Array.isArray(studyNoteGroups?.content) &&
                      studyNoteGroups.content.length > 0 &&
                      studyNoteGroups.content.map((group) => (
                        <Select.Option
                          key={group.id}
                          value={String(group.id)}
                        >
                          {group.title}
                        </Select.Option>
                      ))}

                    {/* 데이터가 없거나, 항상 맨 아래 “추가하기” 노출 */}
                    <Select.Option value="add">
                      <button className="flex w-full cursor-pointer items-center justify-between gap-1 leading-[140%]">
                        <PlusIcon />
                        <span>추가하기</span>
                      </button>
                    </Select.Option>
                  </Select.Content>
                </Select>
              );
            }}
          />
        </Form.Control>
        {errors.teachingNoteGroupId && (
          <Form.ErrorMessage className="text-system-warning text-sm">
            {errors.teachingNoteGroupId.message}
          </Form.ErrorMessage>
        )}
      </Form.Item>

      <AddGroupDialog
        open={openGroup}
        onOpenChange={setOpenGroup}
        roomId={roomId}
        onCreated={(created) => {
          setValue('teachingNoteGroupId', Number(created.id), {
            shouldDirty: true,
          });
          setOpenGroup(false);
        }}
      />
    </ColumnLayout.Left>
  );
};

export default SelectArea;
