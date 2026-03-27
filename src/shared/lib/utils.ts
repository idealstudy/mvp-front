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

export const formatDateDot = (date: Date | string): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const koreanTime = new Date(targetDate.getTime() + 9 * 60 * 60 * 1000);
  const yyyy = koreanTime.getFullYear();
  const mm = String(koreanTime.getMonth() + 1).padStart(2, '0');
  const dd = String(koreanTime.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

export const formatYYYYMMDD = (date: Date | string): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;

  const koreanTime = new Date(targetDate.getTime() + 9 * 60 * 60 * 1000);

  return `${koreanTime.getFullYear()}.${koreanTime.getMonth() + 1}.${koreanTime.getDate()} 까지`;
};

type TipTapNode = {
  type?: string;
  text?: string;
  content?: TipTapNode[];
};

type TipTapDoc = {
  type: 'doc';
  content?: TipTapNode[];
};

function isDoc(v: unknown): v is TipTapDoc {
  return (
    !!v && typeof v === 'object' && (v as { type?: string }).type === 'doc'
  );
}

function collectText(nodes?: TipTapNode[]): string {
  if (!Array.isArray(nodes)) return '';
  let acc = '';
  for (const n of nodes) {
    if (n.type === 'text' && typeof n.text === 'string') acc += n.text;
    if (Array.isArray(n.content)) acc += collectText(n.content);
  }
  return acc;
}

export function extractText(
  input: string,
  opts?: { stripTrailingPunct?: boolean }
): string {
  try {
    const parsed: unknown = JSON.parse(input);
    if (!isDoc(parsed)) return clean(input, opts?.stripTrailingPunct);

    const out = collectText(parsed.content);
    return clean(out, opts?.stripTrailingPunct);
  } catch {
    return clean(input, opts?.stripTrailingPunct);
  }

  function clean(s: string, strip?: boolean) {
    const trimmed = (s ?? '').trim();
    if (!strip) return trimmed;
    return trimmed.replace(/[\s.!?]+$/u, '');
  }
}

export const getDaysSince = (
  startDateStr: string,
  endDateStr?: string | null
): number => {
  const start = new Date(startDateStr);
  if (isNaN(start.getTime())) return 0;
  const end = endDateStr ? new Date(endDateStr) : new Date();
  return (
    Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
};

// utc 시간 처리, input값에 들어가는 현재 날짜 및 시간
export const nowForInput = () => {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};
