import React from 'react';

import Link from 'next/link';

import { Button, Icon } from '@/shared/components/ui';
import { PRIVATE } from '@/shared/constants';

interface StudyRoomListEmptyProps {
  hasRooms: boolean;
  keyword?: string;
  isFiltering?: boolean;
  onReset?: () => void;
}

export const MyRoomListEmpty = ({
  hasRooms,
  keyword,
  isFiltering,
  onReset,
}: StudyRoomListEmptyProps) => {
  if (!hasRooms) {
    return (
      <div className="border-line-line1 bg-system-background-inactive flex flex-col items-center justify-center gap-4 rounded-[24px] border py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
          <Icon.Box className="text-text-sub2 h-6 w-6" />
        </div>
        <div>
          <p className="text-text-main text-lg font-semibold">
            아직 만든 스터디룸이 없어요
          </p>
          <p className="text-text-sub2 mt-1 text-sm">
            첫 스터디룸을 만들어 학생들과의 수업을 시작해보세요.
          </p>
        </div>
        <Button
          variant="primary"
          size="small"
          className="border-none"
          asChild
        >
          <Link href={PRIVATE.ROOM.CREATE}>
            <Icon.Plus className="mr-1.5 h-4 w-4" /> 스터디룸 만들기
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="border-line-line1 bg-gray-scale-gray-1 flex flex-col items-center justify-center gap-4 rounded-[24px] border py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
        <Icon.Search className="text-text-sub2 h-5 w-5" />
      </div>
      <div>
        <p className="text-text-main text-lg font-semibold">
          {isFiltering
            ? '조건에 맞는 스터디룸을 찾지 못했어요'
            : '등록된 스터디룸이 없습니다'}
        </p>
        <p className="text-text-sub2 mt-1 text-sm">
          {isFiltering
            ? keyword?.trim()
              ? `"${keyword.trim()}" 검색 결과가 없어요. 다른 키워드나 필터를 시도해보세요.`
              : '선택한 조건에 맞는 스터디룸이 없어요. 필터를 조정해보세요.'
            : '필요한 스터디룸을 새로 만들어보세요.'}
        </p>
      </div>
      {onReset && (
        <Button
          variant="outlined"
          size="small"
          onClick={onReset}
        >
          필터 초기화
        </Button>
      )}
    </div>
  );
};
