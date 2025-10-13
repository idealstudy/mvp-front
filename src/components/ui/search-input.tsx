import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Icon } from './icon';

type SearchInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'defaultValue'
> & {
  onSearch?: (value: string) => void;
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
};

export const SearchInput = ({
  className,
  placeholder = '검색어를 입력해주세요.',
  onSearch = () => {},
  value: externalValue,
  onChange: externalOnChange,
  defaultValue,
  ...props
}: SearchInputProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');

  const value = externalValue ?? internalValue;
  const onChange = externalOnChange ?? setInternalValue;

  return (
    <div className={cn('relative h-fit', className)}>
      <input
        role="searchbox"
        className={cn(
          'peer border-line-line1 font-body2-normal placeholder:text-text-inactive bg-gray-scale-white flex h-[48px] rounded-[8px] border pr-11 pl-4',
          'focus-visible:border-line-line3 outline-none',
          'disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            onSearch(e.currentTarget.value);
          }
        }}
        {...props}
      />
      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer peer-disabled:opacity-50"
        type="button"
        aria-label="검색"
        onClick={() => onSearch(value)}
      >
        <Icon.Search />
      </button>
    </div>
  );
};
