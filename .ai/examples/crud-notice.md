# Example: notice 도메인 CRUD 산출물

AI agent가 CRUD 생성 시 참조하는 완성 예시.
`create-crud-flow` + `create-post-mutation` skill 실제 출력 형태를 보여준다.

## 도메인 정보

| 항목        | 값                           |
| ----------- | ---------------------------- |
| 도메인      | notice (공지사항)            |
| 엔티티 경로 | `src/entities/notice/`       |
| 피처 경로   | `src/features/notice/hooks/` |

## API 엔드포인트

| Method | Path           | 설명               |
| ------ | -------------- | ------------------ |
| GET    | `/notices`     | 목록 조회 (페이지) |
| GET    | `/notices/:id` | 상세 조회          |
| POST   | `/notices`     | 생성               |
| PUT    | `/notices/:id` | 수정               |
| DELETE | `/notices/:id` | 삭제               |

---

## 1. DTO + Payload

**파일:** `src/entities/notice/infrastructure/notice.dto.ts`

```ts
import { z } from 'zod';

const NoticeDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  isPinned: z.boolean(),
  regDate: z.string(),
  modDate: z.string(),
});

const NoticeListItemDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  isPinned: z.boolean(),
  regDate: z.string(),
});

const NoticeListDtoSchema = z.object({
  totalPages: z.number(),
  totalElements: z.number(),
  content: z.array(NoticeListItemDtoSchema),
});

const NoticeCreatePayloadSchema = z.object({
  title: z.string(),
  content: z.string(),
  isPinned: z.boolean().optional(),
  mediaIds: z.array(z.string()).optional(),
});

const NoticeUpdatePayloadSchema = z.object({
  title: z.string(),
  content: z.string(),
  isPinned: z.boolean().optional(),
  mediaIds: z.array(z.string()).optional(),
});

// DTO: 응답 파싱용 (infrastructure 내부에서만 사용)
export const dto = {
  item: NoticeDtoSchema,
  listItem: NoticeListItemDtoSchema,
  list: NoticeListDtoSchema,
};

// payload: 요청 검증용 (repository에서 .parse() 호출)
export const payload = {
  create: NoticeCreatePayloadSchema,
  update: NoticeUpdatePayloadSchema,
};
```

**포인트**

- `dto`와 `payload`를 반드시 분리 export
- `dto` 스키마는 이 파일 밖으로 직접 export하지 않음 (types/index.ts에서 z.infer<>로만 노출)

---

## 2. Query Key 팩토리

**파일:** `src/entities/notice/infrastructure/notice.keys.ts`

```ts
export const noticeKeys = {
  all: ['notice'] as const,
  list: (params: { page: number; size: number }) =>
    [...noticeKeys.all, 'list', params] as const,
  detail: (id: number) => [...noticeKeys.all, 'detail', id] as const,
};
```

**포인트**

- `all` prefix 필수: invalidateQueries에서 `noticeKeys.all`로 전체 무효화 가능
- 하드코딩 배열 금지: `queryKey: ['notice', 'list']` 형태 절대 사용 금지

---

## 3. Repository

**파일:** `src/entities/notice/infrastructure/notice.repository.ts`

```ts
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';
import { z } from 'zod';

import { dto, payload } from './notice.dto';

const getNotices = async (params: { page: number; size: number }) => {
  const response = await api.private.get('/notices', { params });
  return unwrapEnvelope(response, dto.list);
};

const getNotice = async (id: number) => {
  const response = await api.private.get(`/notices/${id}`);
  return unwrapEnvelope(response, dto.item);
};

const createNotice = async (params: z.infer<typeof payload.create>) => {
  const validated = payload.create.parse(params); // ← payload 검증 필수
  const response = await api.private.post('/notices', validated);
  return unwrapEnvelope(response, dto.item);
};

const updateNotice = async (
  id: number,
  params: z.infer<typeof payload.update>
) => {
  const validated = payload.update.parse(params); // ← payload 검증 필수
  const response = await api.private.put(`/notices/${id}`, validated);
  return unwrapEnvelope(response, dto.item);
};

const deleteNotice = async (id: number) => {
  await api.private.delete(`/notices/${id}`);
};

export const repository = {
  getNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice,
};
```

**포인트**

- 함수 파라미터 타입은 `z.infer<typeof payload.xxx>` 사용
- POST/PUT/PATCH 호출 직전 반드시 `payload.xxx.parse()` 호출
- `api.private` 또는 `api.public`만 사용 (`api.bff.*` 금지)
- `unwrapEnvelope(response, dto.xxx)`로 응답 파싱
- `features` import 절대 금지

---

## 4. UI 타입

**파일:** `src/entities/notice/types/index.ts`

```ts
import { dto, payload } from '@/entities/notice/infrastructure/notice.dto';
import { z } from 'zod';

export type Notice = z.infer<typeof dto.item>;
export type NoticeListItem = z.infer<typeof dto.listItem>;
export type NoticeList = z.infer<typeof dto.list>;

export type NoticeCreatePayload = z.infer<typeof payload.create>;
export type NoticeUpdatePayload = z.infer<typeof payload.update>;
```

**포인트**

- `z.infer<typeof dto.xxx>` 형태로만 export (DTO 스키마 직접 re-export 금지)
- `export { NoticeDtoSchema }` 같은 형태 금지

---

## 5. Mutation Hooks

### 생성

**파일:** `src/features/notice/hooks/use-create-notice.ts`

```ts
import { useRouter } from 'next/navigation';

import { noticeKeys, repository } from '@/entities/notice';
import { handleApiError } from '@/shared/lib/errors/error-handler';
import { classifyNoticeError } from '@/shared/lib/errors/errors';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: repository.createNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
    },
    onError: (error) => {
      handleApiError(error, classifyNoticeError, {
        onField: (msg) => {
          /* 폼 연결 시: setError('root', { message: msg }) */
        },
        onContext: () => router.replace('/notices'),
        onAuth: () => router.replace('/login'),
        onUnknown: () => {},
      });
    },
  });
};
```

### 수정

**파일:** `src/features/notice/hooks/use-update-notice.ts`

```ts
import { useRouter } from 'next/navigation';

import { noticeKeys, repository } from '@/entities/notice';
import type { NoticeUpdatePayload } from '@/entities/notice/types';
import { handleApiError } from '@/shared/lib/errors/error-handler';
import { classifyNoticeError } from '@/shared/lib/errors/errors';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateNotice = (id: number) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (params: NoticeUpdatePayload) =>
      repository.updateNotice(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
    },
    onError: (error) => {
      handleApiError(error, classifyNoticeError, {
        onContext: () => router.replace('/notices'),
        onAuth: () => router.replace('/login'),
        onUnknown: () => {},
      });
    },
  });
};
```

### 삭제

**파일:** `src/features/notice/hooks/use-delete-notice.ts`

```ts
import { useRouter } from 'next/navigation';

import { noticeKeys, repository } from '@/entities/notice';
import { handleApiError } from '@/shared/lib/errors/error-handler';
import { classifyNoticeError } from '@/shared/lib/errors/errors';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteNotice = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: number) => repository.deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
      router.replace('/notices');
    },
    onError: (error) => {
      handleApiError(error, classifyNoticeError, {
        onContext: () => router.replace('/notices'),
        onAuth: () => router.replace('/login'),
        onUnknown: () => {},
      });
    },
  });
};
```

**포인트**

- hook은 반드시 `features/` 에 위치 (entities/ 안에 두지 않음)
- `onSuccess`에 `invalidateQueries` 필수
- 폼 없는 액션: 훅 내부 `onError`에 `handleApiError`
- 폼 있는 mutation: 훅에서 `onError` 제거, 컴포넌트 `mutate(data, { onError })`에서 처리

---

## 완성 체크리스트

```
[ ] dto.ts: dto / payload 분리 export
[ ] keys.ts: all prefix, 키 팩토리 함수
[ ] repository.ts: payload.xxx.parse() POST/PUT/PATCH 직전 호출
[ ] repository.ts: unwrapEnvelope 사용
[ ] repository.ts: api.private / api.public만 사용
[ ] types/index.ts: z.infer<typeof dto.xxx> 형태만 export
[ ] hooks: features/ 에 위치
[ ] hooks: onSuccess에 invalidateQueries
[ ] hooks: handleApiError 위치(훅 vs 컴포넌트) 결정
[ ] classifyNoticeError가 errors.ts에 존재
[ ] bash .ai/hooks/ai-check.sh 통과
```
