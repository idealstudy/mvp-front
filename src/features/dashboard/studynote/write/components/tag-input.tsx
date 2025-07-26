'use client';

import * as React from 'react';

import Image from 'next/image';

import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';

import { ConnectedMember } from '../type';

type TagInputProps = {
  students: ConnectedMember[];
  selected: ConnectedMember[];
  onChange: (selected: ConnectedMember[]) => void;
  error?: boolean;
  disabled?: boolean;
};

export default function TagInput({
  students,
  selected,
  onChange,
  error,
  disabled,
}: TagInputProps) {
  const [input, setInput] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(input.toLowerCase())
  );

  const toggleSelect = (student: ConnectedMember) => {
    const exists = selected.find((s) => s.id === student.id);
    if (exists) {
      onChange(selected.filter((s) => s.id !== student.id));
    } else {
      onChange([...selected, student]);
    }
  };

  const handleTriggerClick = () => {
    setOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <div
            className={cn(
              'border-gray-scale-gray-50 text-gray-scale-gray-40 flex min-h-[56px] cursor-text flex-wrap items-center gap-2 rounded-sm border px-6 py-[15px]',
              open ? 'border-line-line3' : '',
              error ? 'border-system-warning' : '',
              disabled
                ? 'border-light-gray-30 bg-gray-scale-gray-5 text-gray-scale-gray-50'
                : ''
            )}
            onClick={() => {
              if (disabled) return;
              handleTriggerClick();
            }}
          >
            {selected.length <= 0 ? (
              '이 수업을 들은 학생을 선택해 주세요'
            ) : (
              <>
                {/* 선택된 학생 태그들 */}
                {selected.map((student) => (
                  <div
                    key={student.id}
                    className="bg-background-gray border-line-line1 flex items-center gap-1 rounded-sm px-2 py-1 text-sm"
                  >
                    <span className="text-base text-black">{student.name}</span>
                    {student.role === 'ROLE_PARENT' && (
                      <>
                        <span className="text-key-color-primary">•</span>
                        <span className="text-key-color-primary">보호자</span>
                      </>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(student);
                      }}
                      className="ml-1 text-sm leading-none text-gray-400 hover:text-gray-600"
                    >
                      <Image
                        src="/common/close.svg"
                        width={16}
                        height={16}
                        alt="close"
                      />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="z-50 w-[var(--radix-popover-trigger-width)] rounded-lg border bg-white px-5 py-4 shadow-md"
          align="start"
          sideOffset={4}
        >
          {/* 검색 입력 */}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            placeholder="학생을 검색하세요."
            className="bg-background-gray fo w-full rounded-sm px-5 py-4 focus:outline-0"
          />

          {filtered.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              검색 결과가 없습니다
            </div>
          ) : (
            <div className="mt-4 flex max-h-[150px] flex-wrap gap-2 overflow-y-auto">
              {filtered.map((student) => {
                const isSelected = selected.some((s) => s.id === student.id);
                return (
                  <button
                    key={student.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSelect(student);
                      setInput('');
                    }}
                    className={cn(
                      'flex items-center justify-between rounded-sm border px-3 py-2 text-left text-sm transition-colors',
                      isSelected
                        ? 'border-orange-scale-orange-50 bg-background-orange text-black'
                        : 'border-line-line1 text-text-sub1'
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-1">
                      <span className="truncate font-medium">
                        {student.name}
                      </span>
                      {student.role === 'ROLE_PARENT' && (
                        <>
                          <span
                            className={cn(
                              'text-xs',
                              isSelected
                                ? 'text-orange-scale-orange-50'
                                : 'text-text-sub1'
                            )}
                          >
                            •
                          </span>
                          <span
                            className={cn(
                              'text-xs',
                              isSelected
                                ? 'text-orange-scale-orange-50'
                                : 'text-text-sub1'
                            )}
                          >
                            보호자
                          </span>
                        </>
                      )}
                    </div>
                    {isSelected ? (
                      <span className="ml-1 text-orange-500">✓</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
