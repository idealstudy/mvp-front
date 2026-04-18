'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import type { ConnectSearchMemberDTO } from '@/entities/connect';
import { cn } from '@/shared/lib';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@radix-ui/react-popover';

import { useSearchConnectionMembers } from '../../connect/hooks/use-connection';

interface TagInputProps {
  placeholder: string;
  input: string;
  setInput: (value: string) => void;
  selectedMember: ConnectSearchMemberDTO | null;
  onSelectMember: (member: ConnectSearchMemberDTO) => void;
  onClearMember: () => void;
}

export const ConnectTagInput = ({
  placeholder,
  input,
  setInput,
  selectedMember,
  onSelectMember,
  onClearMember,
}: TagInputProps) => {
  const [open, setOpen] = useState(false);
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedKeyword(input.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [input]);

  const { data: searchedMemberData = [], isFetching } =
    useSearchConnectionMembers(
      {
        keyword: debouncedKeyword,
      },
      {
        enabled: debouncedKeyword.length > 0,
      }
    );

  const handleInputChange = (value: string) => {
    setInput(value);
    if (selectedMember) {
      onClearMember();
    }
    if (!open) {
      setOpen(true);
    }
  };

  const handleSelectMember = (member: ConnectSearchMemberDTO) => {
    onSelectMember(member);
    setInput('');
    setOpen(false);
  };

  return (
    <div className="w-full">
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverAnchor asChild>
          <div
            className={cn(
              'border-line-line1 flex min-h-[56px] w-full cursor-text items-center rounded-[4px] border bg-white px-5 transition-colors',
              open
                ? 'border-gray-scale-gray-80'
                : 'hover:border-gray-scale-gray-60'
            )}
            onClick={() => {
              if (selectedMember) return;
              inputRef.current?.focus();
              setOpen(true);
            }}
          >
            {selectedMember ? (
              <div className="bg-background-gray border-line-line1 flex max-w-full items-center gap-2 rounded-sm border py-2 pr-2 pl-3 text-sm">
                <span className="max-w-[120px] truncate text-base text-black">
                  {selectedMember.name}
                </span>
                <span className="text-key-color-primary">•</span>
                <span className="text-key-color-primary max-w-[260px] truncate">
                  {selectedMember.email}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearMember();
                    setInput('');
                  }}
                  className="ml-1 h-6 w-6 cursor-pointer text-sm leading-none text-gray-400 hover:text-gray-600"
                >
                  <Image
                    src="/common/close.svg"
                    width={16}
                    height={16}
                    alt="close"
                  />
                </button>
              </div>
            ) : (
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  handleInputChange(e.target.value);
                }}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                className="font-label-normal text-gray-12 placeholder:text-gray-scale-gray-40 h-full min-w-0 flex-1 bg-transparent outline-none"
              />
            )}
          </div>
        </PopoverAnchor>

        <PopoverContent
          className="border-line-line1 z-50 w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-[4px] border bg-white p-0 shadow-md"
          align="start"
          sideOffset={6}
        >
          {isFetching ? (
            <div className="font-label-normal text-gray-scale-gray-50 px-5 py-4 text-center">
              검색 중입니다.
            </div>
          ) : debouncedKeyword && searchedMemberData.length === 0 ? (
            <div className="font-label-normal text-gray-scale-gray-50 px-5 py-4 text-center">
              검색 결과가 없습니다.
            </div>
          ) : !debouncedKeyword ? (
            <div className="font-label-normal text-gray-scale-gray-50 px-5 py-4 text-center">
              연결할 학생을 검색해보세요.
            </div>
          ) : (
            <div className="max-h-[216px] overflow-y-auto py-2">
              {searchedMemberData.map((student) => {
                const isSelected =
                  selectedMember?.memberId === student.memberId;
                return (
                  <button
                    type="button"
                    key={student.memberId}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelectMember(student);
                    }}
                    className={cn(
                      'hover:bg-background-gray flex w-full items-center justify-between gap-3 px-5 py-3 text-left text-sm transition-colors',
                      isSelected
                        ? 'bg-background-orange text-black'
                        : 'text-text-sub1'
                    )}
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="font-body2-heading text-gray-12 truncate">
                        {student.name}
                      </span>
                      <span
                        className={cn(
                          'font-label-normal truncate',
                          isSelected
                            ? 'text-orange-scale-orange-50'
                            : 'text-text-sub1'
                        )}
                      >
                        {student.email}
                      </span>
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
};
