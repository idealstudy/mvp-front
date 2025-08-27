'use client';

import Image from 'next/image';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

type Props = {
  search: string;
  sort: string;
  limit: number;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (value: string) => void;
  onLimitChange: (value: number) => void;
};

export const SearchFilterBar = ({
  search,
  sort,
  limit,
  onSearch,
  onSortChange,
  onLimitChange,
}: Props) => {
  return (
    <div className="items-cente flex justify-between gap-4">
      <div className="flex gap-[10px]">
        <Select
          defaultValue={sort}
          onValueChange={onSortChange}
        >
          <Select.Trigger
            className="desktop:w-[110px] font-label-normal text-gray-scale-gray-50 h-9 w-full pr-8 pl-3 focus:border-black data-[state=open]:border-black"
            placeholder="최근 편집순"
            data-position="right-2"
          />
          <Select.Content className="w-[110px]">
            <Select.Option
              value="recent"
              className="font-body2-normal h-8 justify-center border-none p-0"
            >
              최근 편집순
            </Select.Option>
            <Select.Option
              value="old"
              className="font-body2-normal h-8 justify-center border-none p-0"
            >
              오래된순
            </Select.Option>
            <Select.Option
              value="alphabetical"
              className="font-body2-normal h-8 justify-center border-none p-0"
            >
              가나다순
            </Select.Option>
            <Select.Option
              value="date"
              className="font-body2-normal h-8 justify-center border-none p-0"
            >
              수업일자순
            </Select.Option>
          </Select.Content>
        </Select>
        <Select
          defaultValue={limit.toString()}
          onValueChange={(value) => onLimitChange(Number(value))}
        >
          <Select.Trigger
            className="desktop:w-[110px] font-label-normal text-gray-scale-gray-50 h-9 w-full pr-8 pl-3 focus:border-black data-[state=open]:border-black"
            placeholder="20개씩"
            data-position="right-2"
          />
          <Select.Content className="w-[110px]">
            <Select.Option
              value="20"
              className="font-body2-normal h-8 justify-center border-none p-0"
            >
              20개씩
            </Select.Option>
            <Select.Option
              value="30"
              className="font-body2-normal h-8 justify-center border-none p-0"
            >
              30개씩
            </Select.Option>
          </Select.Content>
        </Select>
      </div>
      <div className="relative">
        <Input
          className="desktop:max-w-[234px] border-line-line1 h-12 w-full pr-12"
          placeholder="검색어를 입력하세요"
          value={search}
          onChange={onSearch}
        />
        <Image
          src="/studynotes/search.png"
          alt="search"
          width={18}
          height={20}
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
        />
      </div>
    </div>
  );
};
