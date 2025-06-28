import React from 'react';

import Link from 'next/link';

import { format } from 'date-fns';

const RecentlyList = () => {
  // NEXT_TODO : 최근 로그 API 연결하기

  return (
    <section>
      <div className="flex items-center justify-between">
        <span className="text-[20px] font-bold">최근 작성</span>
        <span>
          <Link href="/">전체보기</Link>
        </span>
      </div>
      <ul className="mt-8 grid grid-cols-3 gap-x-[40px] gap-y-[64px]">
        {[1, 2, 3, 4, 5].map((el) => (
          <li
            key={el}
            className="flex cursor-pointer gap-x-6 transition-colors hover:bg-slate-100"
          >
            <div className="h-[165px] w-[130px] rounded-lg bg-gray-200"></div>
            <div className="flex flex-col justify-between py-4">
              <div>{`지수로그 (${el})`}</div>
              <div>{format(new Date(), 'yyyy.MM.dd')}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecentlyList;
