'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';
import * as Popover from '@radix-ui/react-popover';

type TagInputProps = {
  options: string[];
  value: string[];
  onChange: (newTags: string[]) => void;
  hasError?: boolean;
  maxTags?: number;
  allowDuplicates?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  tagClassName?: string;
  className?: string;
  popoverButtonText?: string;
  ['aria-invalid']?: boolean;
};

export const TagInput = ({
  options,
  value,
  onChange,
  hasError = false,
  maxTags,
  allowDuplicates = false,
  disabled = false,
  readOnly = false,
  tagClassName,
  className,
  popoverButtonText = '학생 목록',
  ['aria-invalid']: ariaInvalid,
}: TagInputProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const isError = hasError || ariaInvalid;
  const isMaxTagsReached = Boolean(maxTags && value.length >= maxTags);

  const filteredOptions = options.filter(
    (option) =>
      option.toLowerCase().includes(searchValue.toLowerCase()) &&
      !value.includes(option)
  );

  const handleAddTag = (tag: string) => {
    if (disabled || readOnly) return;

    if (maxTags && value.length >= maxTags) return;

    if (!allowDuplicates && value.includes(tag)) {
      setOpen(false);
      return;
    }

    onChange([...value, tag]);
    setOpen(false);
    setSearchValue('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (disabled || readOnly) return;
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Popover.Root
      open={open && !disabled && !readOnly}
      onOpenChange={setOpen}
    >
      <div className={cn('flex w-full items-center gap-2', className)}>
        <div
          className={cn(
            'flex min-h-[56px] flex-1 flex-wrap items-center gap-2',
            'border-dark-gray-03 border px-3 py-2',
            isError && 'border-red',
            disabled && 'border-light-gray-30 bg-light-gray-01 opacity-50',
            readOnly && 'border-light-gray-30 bg-light-gray-01'
          )}
        >
          {value.map((tag, index) => (
            <Tag
              key={`${tag}-${index}`}
              text={tag}
              onRemove={() => handleRemoveTag(tag)}
              className={tagClassName}
              disabled={disabled || readOnly}
            />
          ))}

          {value.length === 0 && (
            <span className="text-dark-gray-03 text-sm">
              {popoverButtonText}을 눌러 학생을 선택하세요
            </span>
          )}
        </div>

        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled || isMaxTagsReached}
            className={cn(
              'h-[56px] rounded-md border px-4 text-sm whitespace-nowrap',
              'border-dark-gray-03 hover:border-dedu-black transition-colors',
              'focus-visible:border-dedu-black focus-visible:outline-none',
              disabled &&
                'border-light-gray-30 bg-light-gray-01 text-dark-gray-03 cursor-not-allowed',
              isMaxTagsReached &&
                'border-light-gray-30 bg-light-gray-01 text-dark-gray-03 cursor-not-allowed'
            )}
          >
            {popoverButtonText}
            {maxTags && ` (${value.length}/${maxTags})`}
          </button>
        </Popover.Trigger>
      </div>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 max-h-60 w-[300px] overflow-y-scroll rounded-md border bg-white shadow-md"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="border-b p-3">
            <input
              type="text"
              placeholder="학생 이름 검색..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="focus:border-dedu-black w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          <div className="max-h-40 overflow-auto">
            {filteredOptions.length > 0 ? (
              <ul
                role="listbox"
                aria-label="학생 목록"
              >
                {filteredOptions.map((option) => (
                  <li
                    key={option}
                    className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                    onClick={() => handleAddTag(option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-4 text-center text-sm text-gray-400">
                {searchValue
                  ? '일치하는 학생이 없습니다'
                  : '선택할 수 있는 학생이 없습니다'}
              </div>
            )}
          </div>

          <div className="border-t p-3">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setSearchValue('');
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-gray-50"
            >
              닫기
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

// 개별 태그 컴포넌트
type TagProps = {
  text: string;
  onRemove: () => void;
  className?: string;
  disabled?: boolean;
};

const Tag = ({ text, onRemove, className, disabled = false }: TagProps) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
      className={cn(
        'border-dark-gray-03 relative flex w-[120px] items-center justify-center gap-1 rounded-full border bg-[#FFEFE0] px-3 py-[10.5px]',
        'transition-colors hover:bg-orange-100',
        disabled && 'opacity-50',
        className
      )}
    >
      <span
        aria-label={`${text} 태그 삭제`}
        className="h-full w-full truncate"
      >
        {text}
      </span>
    </button>
  );
};
