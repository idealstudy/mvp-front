import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const objectToQueryString = (obj: object): string => {
  return new URLSearchParams(
    Object.entries(obj).reduce(
      (acc, [key, value]) => {
        if (value === undefined || value === null) return acc;
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>
    )
  ).toString();
};

export const getRelativeTimeString = (date: Date | string): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;

  const koreanTime = new Date(targetDate.getTime() + 9 * 60 * 60 * 1000);

  const diffInMs = now.getTime() - koreanTime.getTime();

  // 1초 = 1000ms
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInSeconds < 60) {
    return '방금';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else if (diffInWeeks <= 4) {
    return `${diffInWeeks}주 전`;
  } else {
    // 30일 이상 지난 경우 절대 날짜 반환
    return koreanTime.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
};

export const formatMMDDWeekday = (date: Date | string): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;

  const koreanTime = new Date(targetDate.getTime() + 9 * 60 * 60 * 1000);

  const weekday = ['일', '월', '화', '수', '목', '금', '토'];
  return `${koreanTime.getMonth() + 1}/${koreanTime.getDate()} ${weekday[koreanTime.getDay()]}`;
};
