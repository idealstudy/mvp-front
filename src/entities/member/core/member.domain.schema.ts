import { z } from 'zod';

import { getDisplayName } from '../mapper/member.mapper';
import { base } from '../schema';

const toUndef = (v: unknown) => (v === null ? undefined : v);

/* ─────────────────────────────────────────────────────
 * base 스키마를 가공하여 도메인 기본 구조 생성
 * - password 제거
 * - nullable / undefined를 기본값으로 정리
 * ────────────────────────────────────────────────────*/
const MemberShape = base.schema
  .omit({ password: true })
  .partial()
  .required({ id: true, email: true, role: true })
  .extend({
    name: z.preprocess(toUndef, z.string().default('')),
    nickname: z.preprocess(toUndef, z.string().default('')),
    phoneNumber: z.preprocess(toUndef, z.string().default('')),
    birthDate: z.preprocess(toUndef, z.string().default('')),
    agreeServiceTerms: z.preprocess(toUndef, z.boolean().default(false)),
    agreeMarketing: z.preprocess(toUndef, z.boolean().default(false)),
    agreeAgeCheck: z.preprocess(toUndef, z.boolean().default(false)),
    agreePrivacyTerms: z.preprocess(toUndef, z.boolean().default(false)),
    isProfilePublic: z.preprocess(toUndef, z.boolean().default(false)),
    modNicknameDate: z.preprocess(toUndef, z.string().default('')),
    deletedAt: z.preprocess(toUndef, z.string().default('')),
    deleted: z.preprocess(toUndef, z.boolean().default(false)),
    regDate: z.preprocess(toUndef, z.string().default('')),
    modDate: z.preprocess(toUndef, z.string().default('')),
  });

/* ─────────────────────────────────────────────────────
 * shape에 transform 추가하여 displayName 생성(추가생성 가능)
 * ────────────────────────────────────────────────────*/
const MemberSchema = MemberShape.transform((member) => ({
  ...member,
  name: getDisplayName(
    { email: member.email, name: member.name, nickname: member.nickname },
    '안녕하세요'
  ),
}));

export const domain = {
  schema: MemberSchema,
  shape: MemberShape,
  role: base.role,
};
