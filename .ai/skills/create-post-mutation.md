# Skill: create-post-mutation

## 역할

POST / PUT / PATCH / DELETE 변이(mutation) hook을 생성한다.
모든 mutation hook은 아래 두 가지를 반드시 포함한다.

1. `mutationFn` 내 payload 검증 (`payload.xxx.parse()`)
2. `onSuccess` 내 `invalidateQueries`

`handleApiError`는 폼 여부에 따라 위치가 달라진다 — 아래 **onError 처리 위치 선택** 참조.

---

## Trigger 조건

- "~~ 생성 hook 만들어줘"
- "~~ 수정 / 삭제 mutation 추가해줘"
- repository에 create/update/delete 함수가 이미 있을 때
- `create-crud-flow` skill 실행 후 Step 7로 진입하는 경우

---

## 파일 위치 규칙

```
features/{feature}/hooks/use-create-{domain}.ts
features/{feature}/hooks/use-update-{domain}.ts
features/{feature}/hooks/use-delete-{domain}.ts
```

hook은 반드시 `features/` 안에 위치한다. `entities/` 안에 두지 않는다.

---

## onError 처리 위치 선택

| 상황                                 | 위치                                   | 이유                                                    |
| ------------------------------------ | -------------------------------------- | ------------------------------------------------------- |
| 폼 없는 액션 (토글, 상태 변경, 삭제) | 훅 내부 `useMutation.onError`          | `setError` 불필요                                       |
| 폼 있는 mutation (작성/수정)         | 컴포넌트의 `mutate(data, { onError })` | `setError`가 `useForm` 인스턴스에 묶여 훅에서 접근 불가 |

---

## POST — 리소스 생성

```ts
// features/{feature}/hooks/use-create-{domain}.ts
import { {domain}Keys, repository } from '@/entities/{domain}';
import { classify{Domain}Error } from '@/shared/lib/errors/errors';
import { handleApiError } from '@/shared/lib/errors/error-handler';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useCreate{Domain} = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: repository.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {domain}Keys.all });
    },
    onError: (error) => {
      handleApiError(error, classify{Domain}Error, {
        onField:   (msg) => { /* setError('root', { message: msg }) — 폼이 있으면 추가 */ },
        onContext: ()    => router.replace('/{domain}s'),
        onAuth:    ()    => router.replace('/login'),
        onUnknown: ()    => {},
      });
    },
  });
};
```

**폼과 연결하는 경우** — 훅에서 `onError` 제거, 컴포넌트의 `mutate` 호출 시 처리:

```ts
// 훅: onError 없이 반환
export const useCreate{Domain} = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: repository.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {domain}Keys.all });
    },
  });
};

// 컴포넌트: mutate 호출 시 onError 전달
const { mutate } = useCreate{Domain}();
const { setError } = useForm<{Domain}Form>();

mutate(data, {
  onError: (error) => {
    handleApiError(error, classify{Domain}Error, {
      onField:   (msg) => setError('root', { message: msg }),
      onContext: ()    => router.replace('/{domain}s'),
      onAuth:    ()    => router.replace('/login'),
    });
  },
});
```

---

## PUT — 전체 교체 (수정)

PUT은 payload 전체 필드가 필수다. `payload.update.parse()` — partial 아님.

```ts
// features/{feature}/hooks/use-update-{domain}.ts
import { {domain}Keys, repository } from '@/entities/{domain}';
import { classify{Domain}Error } from '@/shared/lib/errors/errors';
import { handleApiError } from '@/shared/lib/errors/error-handler';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useUpdate{Domain} = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {Domain}Payload) => repository.update(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {domain}Keys.all });
    },
  });
};
```

---

## PATCH — 부분 업데이트

PATCH는 변경된 필드만 전송한다. payload 타입은 `Partial<>`.

```ts
// features/{feature}/hooks/use-update-{domain}-status.ts
export const useUpdate{Domain}Status = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...params }: { id: number } & Partial<{Domain}Payload>) =>
      repository.patch(id, params),
    onSuccess: (_, { id }) => {
      // 상세만 invalidate해도 충분한 경우
      queryClient.invalidateQueries({ queryKey: {domain}Keys.detail(id) });
    },
    onError: (error) => {
      handleApiError(error, classify{Domain}Error, {
        onContext: () => { /* 필요 시 처리 */ },
        onAuth:    () => { /* 필요 시 처리 */ },
      });
    },
  });
};
```

**PUT vs PATCH 선택 기준**

| 상황                                     | HTTP  | payload     | Zod 검증                 |
| ---------------------------------------- | ----- | ----------- | ------------------------ |
| 수정 폼 전체 제출                        | PUT   | 모든 필드   | `payload.update.parse()` |
| 상태값 하나만 변경 (공개여부, 상태 토글) | PATCH | 변경 필드만 | `payload.patch.parse()`  |

---

## DELETE — 리소스 삭제

```ts
// features/{feature}/hooks/use-delete-{domain}.ts
export const useDelete{Domain} = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: number) => repository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {domain}Keys.all });
      router.replace('/{domain}s');
    },
    onError: (error) => {
      handleApiError(error, classify{Domain}Error, {
        onContext: () => router.replace('/{domain}s'),
        onAuth:    () => router.replace('/login'),
      });
    },
  });
};
```

---

## invalidateQueries 범위 결정 기준

```
생성(POST)  → keys.all          목록 전체 갱신
수정(PUT)   → keys.all          목록 + 상세 갱신
수정(PATCH) → keys.detail(id)   상세만 갱신 (목록 영향 없으면)
삭제        → keys.all          목록에서 제거
```

연관 도메인 캐시도 무효화해야 하면 `invalidateQueries`를 추가한다:

```ts
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: {domain}Keys.all });
  queryClient.invalidateQueries({ queryKey: relatedKeys.all }); // 연관 도메인
},
```

---

## Validation Checklist

```
[ ] mutationFn 내에서 payload.xxx.parse() 또는 repository 함수 내부에서 검증
[ ] onSuccess에 invalidateQueries 포함
[ ] handleApiError 처리: 폼 없으면 훅 내부 onError, 폼 있으면 컴포넌트 mutate 호출부
[ ] classify{Domain}Error가 errors.ts에 존재함
[ ] hook 파일이 features/ 에 위치함 (entities/ 아님)
[ ] npm run check-types 통과
```

---

## Retrieval Docs

- `docs/error-handling.md` — classify 함수, handleApiError 패턴
- `docs/entities.md` — repository / keys import 경로
- `.ai/skills/handle-api-error.md` — classify 함수 작성법
