'use client';

import { getRelativeTimeString } from '@/shared/lib';

import { MiniSpinner } from '../../loading';

export interface ReadPersonItem {
  id: number;
  name: string;
  readAt: string | null;
}

interface ReadPeopleListProps {
  data?: ReadPersonItem[];
  displayReadCount?: number;
  isLoading?: boolean;
  isError: boolean;
}

// 읽은 사람들 이름 리스트
export const ReadPeopleList = ({
  data = [],
  displayReadCount,
  isLoading,
  isError,
}: ReadPeopleListProps) => {
  if (isLoading) {
    return (
      <div className="flex min-h-[100px] min-w-[170px] items-center justify-center rounded-sm bg-white p-3 shadow-[15px_25px_65px_0_rgba(0,0,0,0.1),382px_635px_207px_0_rgba(0,0,0,0)]">
        <MiniSpinner size={24} />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex min-h-[100px] min-w-[170px] items-center justify-center rounded-sm bg-white p-3 shadow-[15px_25px_65px_0_rgba(0,0,0,0.1),382px_635px_207px_0_rgba(0,0,0,0)]">
        수업노트를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <div className="z-50 max-h-[110px] min-h-[100px] max-w-[180px] min-w-[170px] overflow-auto rounded-sm bg-white p-3 shadow-[15px_25px_65px_0_rgba(0,0,0,0.1),382px_635px_207px_0_rgba(0,0,0,0)]">
      <div className="mb-1 text-left">
        <p className="font-body2-heading text-gray-12">
          읽음 <span className="text-orange-7">{displayReadCount}</span>
        </p>
      </div>

      {data.map((d) => (
        <div
          key={d.id}
          className="flex justify-between"
        >
          <p className="text-gray-12 font-label-normal">{d.name}</p>
          <p className="font-caption-normal text-gray-5">
            {d.readAt ? getRelativeTimeString(d.readAt) : '-'}
          </p>
        </div>
      ))}
    </div>
  );
};
