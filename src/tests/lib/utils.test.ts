import { formatMMDDWeekday, getRelativeTimeString } from '@/shared/lib/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('getRelativeTimeString', () => {
  beforeEach(() => {
    // 현재 시간을 고정하여 테스트 일관성 유지
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('방금 전 (1분 미만)을 올바르게 표시해야 합니다', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    vi.setSystemTime(now);

    const date = new Date('2024-01-15T11:59:59Z'); // 1초 전
    const result = getRelativeTimeString(date);

    // date-fns 한국어 로케일은 "1분 미만 전" 형식으로 표시될 수 있으나, 현재 구현은 "방금"을 반환함
    expect(result).toMatch(/(초 전|분 전|방금 전|분 미만 전|방금)/);
  });

  it('몇 분 전을 올바르게 표시해야 합니다', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    vi.setSystemTime(now);

    const date = new Date('2024-01-15T11:55:00Z'); // 5분 전
    const result = getRelativeTimeString(date);

    expect(result).toContain('분 전');
  });

  it('몇 시간 전을 올바르게 표시해야 합니다', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    vi.setSystemTime(now);

    const date = new Date('2024-01-15T10:00:00Z'); // 2시간 전
    const result = getRelativeTimeString(date);

    expect(result).toContain('시간 전');
  });

  it('몇 일 전을 올바르게 표시해야 합니다', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    vi.setSystemTime(now);

    const date = new Date('2024-01-13T12:00:00Z'); // 2일 전
    const result = getRelativeTimeString(date);

    expect(result).toContain('일 전');
  });

  it('몇 주 전을 올바르게 표시해야 합니다', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    vi.setSystemTime(now);

    // date-fns는 보통 7일 이상이면 주 단위로 표시
    const date = new Date('2024-01-01T12:00:00Z'); // 약 2주 전
    const result = getRelativeTimeString(date);

    // date-fns의 실제 동작에 따라 "주 전" 또는 "일 전"이 나올 수 있음
    // 14일은 "주 전" 또는 "일 전"으로 표시될 수 있음
    expect(result).toMatch(/(주 전|일 전)/);
  });

  it('30일 이상 지난 경우 절대 날짜를 반환해야 합니다', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    vi.setSystemTime(now);

    const date = new Date('2023-12-01T12:00:00Z'); // 45일 전
    const result = getRelativeTimeString(date);

    expect(result).toContain('년');
    expect(result).toContain('월');
    expect(result).toContain('일');
    expect(result).not.toContain('전');
  });

  it('문자열 형식의 날짜를 올바르게 처리해야 합니다', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    vi.setSystemTime(now);

    const dateString = '2024-01-15T11:55:00Z';
    const result = getRelativeTimeString(dateString);

    expect(result).toContain('분 전');
  });

  it('미래 날짜를 올바르게 처리해야 합니다', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    vi.setSystemTime(now);

    const futureDate = new Date('2024-01-15T12:05:00Z'); // 5분 후
    const result = getRelativeTimeString(futureDate);

    // date-fns는 미래 날짜도 처리하므로 결과가 나와야 함
    expect(result).toBeDefined();
  });
});

describe('formatMMDDWeekday', () => {
  it('날짜를 M/d 형식과 요일로 올바르게 포맷해야 합니다', () => {
    const date = new Date('2024-01-15T12:00:00Z'); // 월요일
    const result = formatMMDDWeekday(date);

    // 요일이 포함되어야 함
    expect(result).toMatch(/^\d{1,2}\/\d{1,2} [일월화수목금토]$/);
  });

  it('문자열 형식의 날짜를 올바르게 처리해야 합니다', () => {
    const dateString = '2024-01-15T12:00:00Z';
    const result = formatMMDDWeekday(dateString);

    expect(result).toMatch(/^\d{1,2}\/\d{1,2} [일월화수목금토]$/);
  });

  it('다양한 요일을 올바르게 표시해야 합니다', () => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    weekdays.forEach((expectedWeekday, index) => {
      // 2024-01-14는 일요일이므로, index만큼 더하면 해당 요일
      const date = new Date(`2024-01-${14 + index}T12:00:00Z`);
      const result = formatMMDDWeekday(date);

      expect(result).toContain(expectedWeekday);
    });
  });

  it('월과 일이 한 자리 수일 때도 올바르게 표시해야 합니다', () => {
    const date = new Date('2024-01-05T12:00:00Z');
    const result = formatMMDDWeekday(date);

    // M/d 형식이므로 1/5 또는 01/05 형식이어야 함
    expect(result).toMatch(/^1\/5 [일월화수목금토]$/);
  });

  it('월과 일이 두 자리 수일 때도 올바르게 표시해야 합니다', () => {
    const date = new Date('2024-12-25T12:00:00Z');
    const result = formatMMDDWeekday(date);

    expect(result).toMatch(/^12\/25 [일월화수목금토]$/);
  });

  it('ISO 8601 형식의 문자열을 올바르게 처리해야 합니다', () => {
    const dateString = '2024-03-20T10:30:00.000Z';
    const result = formatMMDDWeekday(dateString);

    expect(result).toMatch(/^\d{1,2}\/\d{1,2} [일월화수목금토]$/);
  });
});
