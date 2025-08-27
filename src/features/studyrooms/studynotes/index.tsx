'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';

import { StudyNotesList } from './list';

export const StudyNotes = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="items-cente flex justify-between gap-4">
          <div className="flex gap-[10px]">
            <Select defaultValue="1">
              <Select.Trigger
                className="desktop:max-w-[110px] font-label-normal text-gray-scale-gray-50 h-9 pr-8 pl-3 focus:border-black data-[state=open]:border-black"
                placeholder="최근 편집순"
                data-position="right-2"
              />
              <Select.Content className="w-[110px]">
                <Select.Option
                  value="1"
                  className="font-body2-normal h-8 justify-center border-none p-0"
                >
                  최근 편집순
                </Select.Option>
                <Select.Option
                  value="2"
                  className="font-body2-normal h-8 justify-center border-none p-0"
                >
                  오래된순
                </Select.Option>
                <Select.Option
                  value="3"
                  className="font-body2-normal h-8 justify-center border-none p-0"
                >
                  가나다순
                </Select.Option>
                <Select.Option
                  value="4"
                  className="font-body2-normal h-8 justify-center border-none p-0"
                >
                  수업일자순
                </Select.Option>
              </Select.Content>
            </Select>
            <Select defaultValue="1">
              <Select.Trigger
                className="desktop:max-w-[110px] font-label-normal text-gray-scale-gray-50 h-9 pr-8 pl-3 focus:border-black data-[state=open]:border-black"
                placeholder="20개씩"
                data-position="right-2"
              />
              <Select.Content className="w-[110px]">
                <Select.Option
                  value="1"
                  className="font-body2-normal h-8 justify-center border-none p-0"
                >
                  20개씩
                </Select.Option>
                <Select.Option
                  value="2"
                  className="font-body2-normal h-8 justify-center border-none p-0"
                >
                  30개씩
                </Select.Option>
              </Select.Content>
            </Select>
          </div>
          <div className="relative">
            <Input
              className="desktop:max-w-[234px] h-12 w-full pr-12"
              placeholder="검색어를 입력하세요"
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
        <StudyNotesList />
      </div>
      <Pagination
        page={currentPage}
        totalPages={140}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
