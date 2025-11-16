import React from 'react';

const PLACEHOLDER_COUNT = 4;
export const MyRoomListSkeleton = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
        <div
          key={index}
          className="border-line-line1 bg-gray-scale-gray-1 animate-pulse rounded-[24px] border p-6"
        >
          <div className="flex items-start gap-4">
            <div className="bg-gray-scale-gray-10 h-12 w-12 rounded-[14px]" />
            <div className="flex flex-1 flex-col gap-3">
              <div className="bg-gray-scale-gray-10 h-4 w-2/3 rounded" />
              <div className="bg-gray-scale-gray-10 h-3 w-5/6 rounded" />
              <div className="bg-gray-scale-gray-10 h-3 w-4/5 rounded" />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <div className="bg-gray-scale-gray-10 h-3 w-1/2 rounded" />
            <div className="bg-gray-scale-gray-10 h-3 w-1/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
