import { type ClassValue, clsx } from 'clsx';
import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
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
  const targetDate = typeof date === 'string' ? new Date(date) : date;

  const diffInDays = Math.floor(
    (new Date().getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 30일 이상 지난 경우 절대 날짜 반환
  if (diffInDays >= 30) {
    return format(targetDate, 'yyyy년 M월 d일', { locale: ko });
  }

  return formatDistanceToNow(targetDate, {
    addSuffix: true,
    locale: ko,
  });
};

export const formatMMDDWeekday = (date: Date | string): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;

  const weekday = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = weekday[targetDate.getDay()];
  return `${format(targetDate, 'M/d', { locale: ko })} ${dayOfWeek}`;
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
