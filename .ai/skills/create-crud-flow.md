# Skill: create-crud-flow

## 역할

단일 도메인에 대한 CRUD 전체(DTO, payload, keys, repository, types)를 순서대로 생성한다.
mutation hook은 별도 skill(`create-post-mutation.md`)을 참조한다.

---

## Trigger 조건

- "~~ CRUD 만들어줘 / 추가해줘 / 생성해줘"
- "~~ entities 만들어줘"
- endpoint + request body + response schema를 함께 제시하는 경우
- 새 도메인의 repository가 아직 없는 경우

---

## Required Input

AI agent에게 아래 정보를 제공해야 한다.

```
domain: quiz                         # 단수 소문자 (파일명/변수명 기준)
domainPascal: Quiz                   # PascalCase (타입/변수명)
endpoints:
  list:   GET    /teacher/quizzes
  detail: GET    /teacher/quizzes/{id}
  create: POST   /teacher/quizzes
  update: PUT    /teacher/quizzes/{id}
  delete: DELETE /teacher/quizzes/{id}
request_body:
  studyRoomId: number
  title: string
  content: string
response_item:
  id: number
  title: string
  content: string
  createdAt: string        # ISO 8601 날짜 문자열
list_paginated: true       # false면 배열 단순 반환
error_codes:               # 선택값. 없으면 default: UNKNOWN만 작성
  FIELD:                   # 사용자가 입력 수정으로 해결 가능
    - QUIZ_DUPLICATE_TITLE
  CONTEXT:                 # 리소스 소멸 / 페이지 무효
    - QUIZ_NOT_FOUND
  AUTH:                    # 권한 없음 / 재로그인
    - QUIZ_FORBIDDEN
```

---

## Steps

### Step 1 — 디렉토리 구조 확인

```
entities/{domain}/
  infrastructure/
    {domain}.dto.ts          ← 응답 DTO + 요청 payload 스키마
    {domain}.repository.ts   ← API 호출 + 응답 파싱
    {domain}.keys.ts         ← TanStack Query 키 팩토리
  types/
    index.ts                 ← UI 소비용 타입만 export
  index.ts                   ← 외부 공개 barrel
```

아직 없으면 위 구조로 디렉토리를 생성한다.

---

### Step 2 — DTO 스키마 생성

파일: `entities/{domain}/infrastructure/{domain}.dto.ts`

**규칙**

- 응답 스키마는 `dto` 객체로 묶어 export
- 요청 스키마(payload)는 `payload` 객체로 묶어 별도 export
- 날짜는 `z.string()` (ISO 문자열, 변환 없이 사용)
- nullable 필드는 `.nullable()` 또는 `.nullish()`
- enum은 `z.enum([...])` 별도 선언 후 재사용

```ts
import { z } from 'zod';

// ── 응답 DTO ──────────────────────────────────────────
const {Domain}ItemDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

// 페이지네이션 응답인 경우
const {Domain}ListDtoSchema = z.object({
  totalPages: z.number(),
  totalElements: z.number(),
  content: z.array({Domain}ItemDtoSchema),
});

// ── 요청 payload ─────────────────────────────────────
const {Domain}PayloadSchema = z.object({
  studyRoomId: z.number(),
  title: z.string().min(1, '제목은 필수입니다.'),
  content: z.string(),
});

// 부분 업데이트(PATCH)용 — PUT에는 불필요
const {Domain}PatchPayloadSchema = {Domain}PayloadSchema.partial();

// ── export ────────────────────────────────────────────
export const dto = {
  item: {Domain}ItemDtoSchema,
  list: {Domain}ListDtoSchema,         // 페이지네이션 없으면 생략
};

export const payload = {
  create: {Domain}PayloadSchema,
  update: {Domain}PayloadSchema,       // PUT: 전체 필드 동일
  patch:  {Domain}PatchPayloadSchema,  // PATCH: 부분 필드 (필요 시만)
};
```

---

### Step 3 — Query Key 팩토리 생성

파일: `entities/{domain}/infrastructure/{domain}.keys.ts`

**규칙**

- `all` 배열이 최상위 prefix — 전체 invalidate 시 사용
- 파라미터가 없는 키는 `() =>` 함수 형태 유지 (일관성)
- 접두어 키(Prefix)는 `invalidateQueries` 범위 제한에 사용

```ts
export const {domain}Keys = {
  all: ['{domain}'] as const,

  list: (params: { page: number; size: number }) =>
    [...{domain}Keys.all, 'list', params] as const,

  detail: (id: number) =>
    [...{domain}Keys.all, 'detail', id] as const,
};
```

페이지네이션 없는 단순 목록이면:

```ts
list: () => [...{domain}Keys.all, 'list'] as const,
```

---

### Step 4 — Repository 생성

파일: `entities/{domain}/infrastructure/{domain}.repository.ts`

**규칙**

- `api.private` 또는 `api.public` 만 사용 (`api.bff.*` 금지)
- 응답 파싱: `unwrapEnvelope(response, dto.xxx)` 사용
- 요청 전 payload 검증: `payload.xxx.parse(params)` 호출
- 반환 타입은 명시하지 않아도 되지만, 복잡하면 명시
- 마지막에 `export const repository = { ... }` 로 묶어 export

```ts
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';

import { dto, payload } from './{domain}.dto';

// ── [LIST] GET /teacher/{domain}s ─────────────────────
const get{Domain}List = async (params: { page: number; size: number }) => {
  const response = await api.private.get('/{role}/{domain}s', { params });
  return unwrapEnvelope(response, dto.list);
};

// ── [DETAIL] GET /teacher/{domain}s/{id} ─────────────
const get{Domain} = async (id: number) => {
  const response = await api.private.get(`/{role}/{domain}s/${id}`);
  return unwrapEnvelope(response, dto.item);
};

// ── [CREATE] POST /teacher/{domain}s ─────────────────
const create{Domain} = async (params: z.infer<typeof payload.create>) => {
  const validated = payload.create.parse(params);
  const response = await api.private.post('/{role}/{domain}s', validated);
  return unwrapEnvelope(response, dto.item);
};

// ── [UPDATE] PUT /teacher/{domain}s/{id} ─────────────
const update{Domain} = async (id: number, params: z.infer<typeof payload.update>) => {
  const validated = payload.update.parse(params);
  const response = await api.private.put(`/{role}/{domain}s/${id}`, validated);
  return unwrapEnvelope(response, dto.item);
};

// ── [DELETE] DELETE /teacher/{domain}s/{id} ──────────
const delete{Domain} = async (id: number) => {
  await api.private.delete(`/{role}/{domain}s/${id}`);
};

// ── 내보내기 ──────────────────────────────────────────
export const repository = {
  getList: get{Domain}List,
  get: get{Domain},
  create: create{Domain},
  update: update{Domain},
  delete: delete{Domain},
};
```

**CREATE가 ID만 반환하는 경우** (SuccessId 패턴):

```ts
import type { SuccessId } from '@/types';
// unwrapEnvelope 대신:
const response = await api.private.post('/...', validated);
return unwrapEnvelope(response, z.object({ id: z.number() }));
```

---

### Step 5 — Types 내보내기

파일: `entities/{domain}/types/index.ts`

**규칙**

- DTO 타입을 직접 export하지 않는다 — `z.infer<>` 로 변환한 타입만
- 컴포넌트는 이 파일의 타입만 소비한다

```ts
import { z } from 'zod';
import { dto, payload } from '../infrastructure/{domain}.dto';

export type {Domain} = z.infer<typeof dto.item>;
export type {Domain}List = z.infer<typeof dto.list>;
export type {Domain}Payload = z.infer<typeof payload.create>;
```

---

### Step 6 — Barrel export

파일: `entities/{domain}/index.ts`

```ts
export { repository } from './infrastructure/{domain}.repository';
export { {domain}Keys } from './infrastructure/{domain}.keys';
export type { {Domain}, {Domain}List, {Domain}Payload } from './types';
```

---

### Step 7 — classify 에러 함수 추가

파일: `src/shared/lib/errors/errors.ts` 에 추가

```ts
export function classify{Domain}Error(code?: string): ApiErrorType {
  switch (code) {
    // FIELD: 사용자가 입력값을 고쳐서 해결 가능
    case '{DOMAIN}_INVALID_INPUT':
      return 'FIELD';

    // CONTEXT: 리소스 소멸 / 페이지가 더 이상 유효하지 않음
    case '{DOMAIN}_NOT_FOUND':
    case '{DOMAIN}_ALREADY_EXISTS':
      return 'CONTEXT';

    // AUTH: 권한 없음 / 재로그인 필요
    case '{DOMAIN}_FORBIDDEN':
    case 'MEMBER_NOT_EXIST':
      return 'AUTH';

    default:
      return 'UNKNOWN';
  }
}
```

`error_codes`가 제공된 경우 해당 케이스를 채운다.
제공되지 않은 경우 `default: return 'UNKNOWN'` 만 작성하고 코드가 확정되면 채운다.

---

## Validation Checklist

생성 후 아래 항목을 순서대로 확인한다.

```
[ ] dto.ts에 dto / payload 객체가 분리 export되어 있음
[ ] keys.ts의 all 배열이 단일 도메인 문자열 prefix임
[ ] repository에서 features 디렉토리를 import하지 않음
[ ] repository 내 모든 함수에서 payload.xxx.parse() 호출 후 API 호출
[ ] types/index.ts에 DTO 타입 직접 export 없음 (z.infer<> 사용)
[ ] domain.ts가 infrastructure를 import하지 않음 (변환 필요 시)
[ ] errors.ts에 classify{Domain}Error 추가됨
[ ] yarn tsc --noEmit 통과
[ ] yarn lint 통과
```

---

## Retrieval Docs

실행 전 아래 파일을 읽는다.

- `docs/entities.md` — 전체 구조 규칙
- `docs/architecture.md` — API 클라이언트, 레이어 규칙
- `docs/error-handling.md` — classify 함수 추가 위치
