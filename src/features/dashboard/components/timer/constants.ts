export const nowKST = () =>
  new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString();

export const SUBJECT_TO_KOREAN: Record<string, string> = {
  KOREAN: '국어',
  ENGLISH: '영어',
  MATH: '수학',
  OTHER: '기타',
};

export const formatMinSec = (seconds: number): string => {
  if (seconds >= 3600) {
    const hr = Math.floor(seconds / 3600);
    const min = Math.floor((seconds % 3600) / 60);
    return min > 0 ? `${hr}시간 ${min}분` : `${hr}시간`;
  }
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  if (min === 0) return `${sec}초`;
  return sec > 0 ? `${min}분 ${sec}초` : `${min}분`;
};

export const formatStudyTime = (seconds: number): string => {
  if (seconds >= 3600) return `${Math.floor(seconds / 3600)}시간`;
  if (seconds <= 0) return '0분';
  return `${Math.max(1, Math.floor(seconds / 60))}분`;
};

export const formatHHMMSS = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
};
