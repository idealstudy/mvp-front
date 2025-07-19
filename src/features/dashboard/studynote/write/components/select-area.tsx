'use client';

import { useState } from 'react';

import Image from 'next/image';

import { ColumnLayout } from '@/components/layout/column-layout';
import { Select } from '@/components/ui/select';

const SelectArea = () => {
  const [value, setValue] = useState<string>('');

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
      <label className="text-text-sub2 text-base font-semibold">
        수업노트 그룹
      </label>
      <Select
        value={value}
        onValueChange={setValue}
      >
        <Select.Trigger
          placeholder="없음"
          className="mt-[9px]"
        />
        <Select.Content>
          <Select.Option value="apple">사과</Select.Option>
          <Select.Option value="banana">바나나</Select.Option>
          <Select.Option value="grape">포도</Select.Option>
        </Select.Content>
      </Select>
    </ColumnLayout.Left>
  );
};

export default SelectArea;
