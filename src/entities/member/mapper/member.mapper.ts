import type { MemberDTO } from '../types';

const localPart = (email: string) => email.split('@')[0];

// 우선순위: 이름 > 닉네임 > 대체값 > 이메일의 로컬 파트
export const getDisplayName = (
  m: Pick<MemberDTO, 'email'> & Partial<Pick<MemberDTO, 'name' | 'nickname'>>,
  fallback?: string
): string => {
  const name = m.name?.trim();
  if (name && name.length > 0) return name;

  const nick = m.nickname?.trim();
  if (nick && nick.length > 0) return nick;

  const fb = fallback?.trim();
  if (fb && fb.length > 0) return fb;

  return localPart(m.email)!;
};
