# Skill: create-form-mutation

## 역할

react-hook-form + useMutation을 결합한 폼 기반 mutation 흐름을 이 프로젝트 규칙에 맞게 생성한다.
이 문서는 RHF·React Query 설명서가 아니라 **이 프로젝트에서 form mutation을 구현하는 방식**을 정의하는 playbook이다.

---

## Trigger 조건

- "~~ 작성 폼 만들어줘"
- "~~ 수정 폼 추가해줘"
- 폼 제출 시 API를 호출해야 하는 모든 경우
- `create-post-mutation` skill 실행 후 폼 연결 단계로 진입하는 경우

---

## 이 Skill이 해결하는 문제

AI agent가 form + mutation 흐름을 생성할 때 반복되는 실패 패턴:

- mutation마다 `handleApiError` 위치가 달라지는 불일치
- `setError('root', ...)` 누락으로 서버 에러가 UI에 표시되지 않음
- `onSuccess`에서 `invalidateQueries` 누락
- `mutateAsync` 남용 (async/await wrapping + 중복 try-catch)
- hook 내부에서 `router.push` 또는 `toast` 직접 호출
- form state와 mutation state를 분리하지 않고 혼재
- `api.private` / `api.public`을 feature 컴포넌트에서 직접 호출

---

## 기본 원칙

| 규칙                           | 설명                                                                                                                                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| form 상태는 RHF                | 사용자가 제출하는 field 값과 validation error는 `useForm`이 관리. `mutation` 진행 상태는 `isPending` 사용. 단, 제출 payload에 포함되지 않는 UI-only 상태(dialog open, tag input draft, select display value, editor upload state)는 `useState`/`useMemo` 허용 |
| API 호출은 repository 경유     | `mutationFn` 내부에서 `api.private` / `api.public` 직접 호출 금지                                                                                                                                            |
| query key factory 필수         | `invalidateQueries` 호출 시 key 배열 하드코딩 금지                                                                                                                                                           |
| `handleApiError` 위치 일관성   | 폼 있으면 컴포넌트, 폼 없으면 hook — 아래 규칙 참조                                                                                                                                                          |
| 서버 에러 → `setError('root')` | 서버 전역 에러는 반드시 form error로 연결 가능해야 함                                                                                                                                                        |
| 성공 후 UX 흐름 명시           | redirect / invalidate / modal close / reset을 onSuccess에서 처리                                                                                                                                             |
| 공유 UI 컴포넌트 사용          | 사용자에게 노출되는 form shell과 주요 입력 컨트롤은 `@/shared/components/ui`의 `Form`, `Input`, `Textarea`, `Button` 등을 우선 사용. 단, icon button, 숨김 input, 접근성·브라우저 기본 동작이 필요한 경우 native element 허용 |
| route 상수 사용                | `router.replace('/login')` 등 경로 문자열 하드코딩 금지. `PRIVATE` / `PUBLIC` from `@/shared/constants/route` 사용                                                                                           |
| schema 별도 파일               | `{Domain}FormSchema`와 `type {Domain}Form`은 `features/{feature}/schema/schema.ts`에 분리. 컴포넌트 파일 인라인 금지                                                                                         |

---

## 생성 순서 (실행 절차)

### Step 1 — Zod schema / domain 타입 확인

`entities/{domain}/infrastructure/{domain}.dto.ts` 와 `entities/{domain}/types/` 에서
payload schema 및 domain 타입이 있는지 확인한다.
없으면 `create-crud-flow` skill을 먼저 실행한다.

### Step 2 — repository mutation 함수 확인

`entities/{domain}/infrastructure/{domain}.repository.ts`에
`create` / `update` 함수가 있는지 확인한다.
없으면 repository를 먼저 추가한다.

### Step 3 — query key factory 확인

`entities/{domain}/infrastructure/{domain}.keys.ts`에 key factory가 있는지 확인한다.
`invalidateQueries` 호출에서 사용할 key가 정의되어 있어야 한다.

### Step 4 — mutation hook 생성

폼 연결을 전제로 hook은 `onError` 없이 작성한다.
`handleApiError`는 컴포넌트의 `mutate` 호출부에서 처리한다.

```ts
// features/{feature}/hooks/use-create-{domain}.ts
import { {domain}Keys, repository } from '@/entities/{domain}';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreate{Domain} = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: repository.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {domain}Keys.all });
    },
    // onError 없음 — 폼 컴포넌트의 mutate(data, { onError })에서 처리
  });
};
```

수정(PUT) 예시:

```ts
// features/{feature}/hooks/use-update-{domain}.ts
export const useUpdate{Domain} = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {Domain}Payload) => repository.update(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {domain}Keys.detail(id) });
      queryClient.invalidateQueries({ queryKey: {domain}Keys.all });
    },
  });
};
```

### Step 5 — 폼 schema 작성

schema는 반드시 별도 파일로 분리한다. 컴포넌트 파일에 인라인으로 작성하지 않는다.
`type`도 schema 파일에서 함께 export한다.

```ts
// features/{feature}/schema/schema.ts
import { z } from 'zod';

export const {Domain}FormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').max(100, '100자 이내로 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
});

export type {Domain}Form = z.infer<typeof {Domain}FormSchema>;
```

### Step 6 — useForm 초기화

`zodResolver`와 `defaultValues`를 함께 설정한다.

```ts
import { {Domain}FormSchema, {Domain}Form } from '../schema/schema';

const {
  register,
  handleSubmit,
  setError,
  formState: { errors, isSubmitting, isDirty, isValid },
} = useForm<{Domain}Form>({
  resolver: zodResolver({Domain}FormSchema),
  defaultValues: {
    title: '',
    content: '',
  },
});
```

`register`로 연결할 수 없는 controlled 컴포넌트는 `Controller`로 감싼다:

| 컴포넌트 | 이유 |
| -------- | ---- |
| `Select` | `onValueChange` / `value` prop 필요 |
| `TextEditor` | Tiptap JSONContent 타입, `onChange` 커스텀 |
| 기타 custom controlled component | `ref` 전달이 불가하거나 value/onChange 인터페이스가 다른 경우 |

```tsx
<Controller
  name="subject"
  control={control}
  render={({ field }) => (
    <Select value={field.value} onValueChange={field.onChange}>
      ...
    </Select>
  )}
/>
```

수정 폼은 `defaultValues`에 기존 데이터를 주입한다:

```ts
defaultValues: {
  title: data?.title ?? '',
  content: data?.content ?? '',
},
```

단, RHF는 비동기 데이터가 나중에 로드되어도 `defaultValues`를 자동으로 갱신하지 않는다.
데이터가 비동기로 들어오는 경우 `useEffect`에서 `reset()`을 호출해야 `isDirty` 기준도 올바르게 초기화된다.

```ts
useEffect(() => {
  if (data) {
    reset({ title: data.title, content: data.content });
  }
}, [data, reset]);
```

`setValue`로 초기값을 채우는 방식은 `isDirty` 기준이 초기화되지 않으므로 피한다.

### Step 7 — handleSubmit 연결

`form`의 `onSubmit`에 `handleSubmit`을 연결한다.

```tsx
<Form onSubmit={handleSubmit(onSubmit)}>
```

### Step 8 — mutate 호출 + onError 처리

`mutate(data, { onError })`를 사용한다. `mutateAsync` 사용 금지.
`handleApiError`는 이 위치에서만 호출한다.

```ts
import { classify{Domain}Error } from '@/shared/lib/errors/errors';
import { handleApiError } from '@/shared/lib/errors/error-handler';
import { PRIVATE, PUBLIC } from '@/shared/constants/route';
import { useRouter } from 'next/navigation';

const router = useRouter();
const { mutate, isPending } = useCreate{Domain}();

const onSubmit = (data: {Domain}Form) => {
  mutate(data, {
    onError: (error) => {
      handleApiError(error, classify{Domain}Error, {
        onField:   (msg) => setError('root', { message: msg }),
        onContext: ()    => setTimeout(() => router.replace(PRIVATE.{DOMAIN}.LIST), 1500),
        onAuth:    ()    => setTimeout(() => router.replace(PUBLIC.CORE.LOGIN), 1500),
        onUnknown: ()    => {},
      });
    },
  });
};
```

### Step 9 — invalidate / redirect / 성공 UX 처리

성공 후 UX 흐름은 mutation hook의 `onSuccess`에서 처리한다 — 아래 기준 참조.

---

## handleApiError 위치 규칙

가장 중요한 규칙. 반드시 이 기준을 따른다.

| 상황                                 | 위치                                   | 이유                                                        |
| ------------------------------------ | -------------------------------------- | ----------------------------------------------------------- |
| 폼 기반 mutation (작성/수정)         | 컴포넌트의 `mutate(data, { onError })` | `setError`가 `useForm` 인스턴스에 종속 — hook에서 접근 불가 |
| 폼 없는 액션 (삭제, 상태 변경, 토글) | hook 내부 `useMutation.onError`        | `setError` 불필요                                           |

**좋은 예 — 폼 기반:**

```ts
// hook: onError 없음
export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: repository.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
    },
  });
};

// 컴포넌트: onError에서 setError 연결
mutate(data, {
  onError: (error) => {
    handleApiError(error, classifyNoticeError, {
      onField: (msg) => setError('root', { message: msg }),
      onContext: () => setTimeout(() => router.replace(PRIVATE.NOTICE.LIST), 1500),
      onAuth: () => setTimeout(() => router.replace(PUBLIC.CORE.LOGIN), 1500),
    });
  },
});
```

**나쁜 예 — hook 내부에서 setError 시도:**

```ts
// hook 내부에서 setError에 접근할 수 없음
export const useCreateNotice = (setError: UseFormSetError<NoticeForm>) => {
  return useMutation({
    onError: (error) => {
      handleApiError(error, classifyNoticeError, {
        onField: (msg) => setError('root', { message: msg }), // 안티패턴
      });
    },
  });
};
```

---

## mutate vs mutateAsync 선택 기준

기본은 `mutate`. 아래 경우에만 `mutateAsync`를 사용한다.

| 상황                                             | 선택                        |
| ------------------------------------------------ | --------------------------- |
| 단순 폼 제출 (create, update)                    | `mutate(data, { onError })` |
| 여러 mutation을 순서대로 실행해야 하는 경우      | `mutateAsync` + try-catch   |
| 결과값을 기반으로 다음 단계를 결정해야 하는 경우 | `mutateAsync`               |

**mutateAsync 남용 예 (금지):**

```ts
// 단순 폼 제출에 mutateAsync 사용 — 불필요한 패턴
const onSubmit = async (data: NoticeForm) => {
  try {
    await mutateAsync(data);
    router.push('/notices');
  } catch (error) {
    console.error(error); // handleApiError 없이 console.error만
  }
};
```

---

## setError('root') vs field error 기준

| 상황                                                    | 사용                                 |
| ------------------------------------------------------- | ------------------------------------ |
| 서버 전역 에러 (요청 자체가 거부됨)                     | `setError('root', { message })`      |
| 비밀번호 불일치, 중복 요청, 권한 없음                   | `setError('root', { message })`      |
| 특정 필드 입력값이 잘못됨 (서버가 필드를 특정해서 반환) | `setError('fieldName', { message })` |

`root` 에러는 폼 하단 또는 버튼 위에 표시한다:

```tsx
{
  errors.root && (
    <p className="text-system-warning text-sm">{errors.root.message}</p>
  );
}
```

`handleApiError`의 `onField` 콜백에서 서버 메시지를 root로 연결하는 것이 기본 패턴이다:

```ts
onField: (msg) => setError('root', { message: msg }),
```

특정 필드에 서버 에러를 표시해야 한다면 필드명을 직접 지정한다:

```ts
onField: (msg) => setError('email', { message: msg }),
```

**`onField`를 쓸 때는 반드시 폼에 표시 영역을 함께 둔다.** `setError('root', ...)`를 호출해도 `errors.root`를 렌더링하는 JSX가 없으면 에러가 사라진다.

해당 도메인의 classify 함수에 `FIELD` 에러가 없으면 `onField`도 생략하고, root error UI도 추가하지 않는다.

```ts
// FIELD 에러가 없는 도메인 — onField 생략, root error UI 불필요
handleApiError(error, classifyXxxError, {
  onContext: () => setTimeout(() => router.replace(PRIVATE.XXX.LIST), 1500),
  onAuth:    () => setTimeout(() => router.replace(PUBLIC.CORE.LOGIN), 1500),
  onUnknown: () => {},
});
```

---

## invalidateQueries 기준

```
생성(POST) → {domain}Keys.all          목록 전체 갱신
수정(PUT)  → {domain}Keys.all          목록 + 상세 갱신
             {domain}Keys.detail(id)   (둘 다 invalidate)
수정(PATCH)→ {domain}Keys.detail(id)   상세만 갱신 (목록에 영향 없으면)
```

key factory 없이 하드코딩 금지:

```ts
// 금지
queryClient.invalidateQueries({ queryKey: ['notice'] });
queryClient.invalidateQueries({ queryKey: ['notice', 'list'] });

// 정상
queryClient.invalidateQueries({ queryKey: noticeKeys.all });
queryClient.invalidateQueries({ queryKey: noticeKeys.detail(id) });
```

연관 도메인 캐시도 무효화해야 하면 추가한다:

```ts
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: noticeKeys.all });
  queryClient.invalidateQueries({ queryKey: relatedKeys.all });
},
```

---

## 성공 후 UX 흐름 기준

mutation hook의 기본 책임은 **repository 호출 + cache invalidation**이다.
`invalidateQueries`는 항상 hook의 `onSuccess`에 남긴다.

성공 후 navigation / modal close / toast의 위치는 아래 기준으로 결정한다.

| 상황 | 위치 |
| ---- | ---- |
| hook이 특정 화면 전용이고 redirect 경로가 고정 | hook `onSuccess` |
| redirect 경로가 runtime param에 의존 (예: `PRIVATE.HOMEWORK.LIST(studyRoomId)`) | component `mutate(data, { onSuccess })` |
| modal close, draft 정리, 다른 hook 호출 등 컴포넌트 상태에 의존 | component `mutate(data, { onSuccess })` |
| modal 폼 — 닫기 콜백 주입 | hook 파라미터 `onSuccess?: () => void` 수신 후 `onSuccess?.()` 호출 |
| 별도 toast 필요 | `toast.success()`는 `onSuccess`에서 — `onError` 내에서 중복 호출 금지 |

**고정 redirect 예시 (hook `onSuccess`):**

```ts
export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: repository.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
      router.replace(PRIVATE.NOTICE.LIST); // 경로 고정
    },
  });
};
```

**dynamic redirect 예시 (component `onSuccess`):**

```ts
// hook: invalidateQueries만 담당
export const useCreateHomework = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: repository.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homeworkKeys.all });
    },
  });
};

// 컴포넌트: runtime param / 연관 side effect
mutate({ studyRoomId, body }, {
  onSuccess: () => {
    router.replace(PRIVATE.HOMEWORK.LIST(studyRoomId));
    sendOnboarding();
  },
  onError: (error) => { ... },
});
```

modal 폼은 `onClose` 콜백을 hook 파라미터로 받는다:

```ts
export const useCreateNotice = ({
  onSuccess,
}: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: repository.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
      onSuccess?.();
    },
  });
};
```

---

## submit button disabled 기준

```tsx
<Button
  type="submit"
  disabled={isPending || !isDirty || !isValid}
>
  저장
</Button>
```

| 조건        | 이유                                  |
| ----------- | ------------------------------------- |
| `isPending` | mutation 진행 중 중복 제출 방지       |
| `!isDirty`  | 변경사항 없으면 제출 불필요 (수정 폼) |
| `!isValid`  | schema 검증 통과 전 제출 방지         |

`!isValid`를 disabled 조건에 쓸 때는 `useForm`에 `mode: 'onChange'`를 명시한다.
`mode` 없이 `!isValid`를 쓰면 첫 렌더에서 버튼이 항상 비활성 상태로 시작한다.

```ts
useForm<{Domain}Form>({
  resolver: zodResolver({Domain}FormSchema),
  mode: 'onChange',
  defaultValues: { ... },
});
```

- 수정 폼은 기본적으로 `!isDirty`를 포함한다.
- 작성 폼에서 제출 후 에러를 보여주는 UX(최초 빈 값 제출 허용)가 필요하면 `!isValid` 조건을 제거할 수 있다.

---

## 파일 위치

```
src/entities/{domain}/
  infrastructure/
    {domain}.repository.ts     ← create / update / delete 함수
    {domain}.keys.ts           ← query key factory
    {domain}.dto.ts            ← Zod payload schema
  types/
    {domain}.types.ts          ← domain 타입 정의

src/features/{feature}/
  hooks/
    use-create-{domain}.ts     ← mutation hook (onError 없이)
    use-update-{domain}.ts
  schema/
    schema.ts                  ← {Domain}FormSchema + type {Domain}Form
  components/
    {domain}-create-form.tsx   ← RHF 폼 + mutate onError 처리
    {domain}-edit-form.tsx
```

**기존 도메인에 추가할 때는 해당 도메인의 파일명·함수명 컨벤션을 따른다.**
표준 구조(`use-create-{domain}.ts`, `schema/schema.ts` 등)는 새 도메인에만 적용한다.
기존 파일이 `useTeacherHomeworkMutations.ts`처럼 다른 네이밍을 쓰고 있다면 그 파일에 함수를 추가하거나 같은 스타일로 파일을 만든다.

---

## Anti-patterns

아래 패턴이 보이면 즉시 수정한다.

```ts
// 1. hook 내부에서 toast 직접 처리
onError: (error) => {
  toast.error('오류가 발생했습니다'); // 금지 — handleApiError가 처리
},

// 2. hook onSuccess에서 경로 문자열 하드코딩
onSuccess: () => {
  router.push('/notices'); // 금지 — PRIVATE / PUBLIC 상수 사용
},
// hook의 router 호출 자체는 경로가 고정일 때 허용.
// runtime param 의존 / 다른 hook 호출 필요 시 component mutate onSuccess에서 처리

// 3. queryKey 하드코딩
queryClient.invalidateQueries({ queryKey: ['notice'] }); // 금지

// 4. mutateAsync + try-catch로 단순 폼 제출
const onSubmit = async (data) => {
  try { await mutateAsync(data); }
  catch { console.error(error); } // handleApiError 없이 무효 처리
};

// 5. setError 없이 generic alert만
onError: () => alert('에러가 발생했습니다.'), // 금지

// 6. handleApiError 없이 console.error만
onError: (error) => console.error(error), // 금지

// 7. feature 컴포넌트에서 api.private 직접 호출
const onSubmit = async (data) => {
  await api.private.post('/notices', data); // 금지 — repository 경유
};

// 8. hook에 setError를 파라미터로 주입
export const useCreateNotice = (setError: UseFormSetError<NoticeForm>) => { ... };
// 금지 — hook과 form state 결합. 컴포넌트의 mutate onError에서 처리

// 9. 경로 문자열 하드코딩
router.replace('/login');   // 금지
router.replace('/notices'); // 금지
// → PRIVATE / PUBLIC 상수 사용.
// 필요한 경로가 route.ts에 없으면, 먼저 src/app/ 하위에 실제 라우트 파일이 존재하는지 확인한 뒤 route.ts에 추가

// 10. form shell / 주요 입력 컨트롤에 native element 직접 사용
<form onSubmit={...}>                         // → <Form onSubmit={...}>
  <input {...register('title')} />            // → <Input />
  <button type="submit">저장</button>         // → <Button type="submit">저장</Button>
</form>
// icon button, 숨김 input, 접근성 목적의 native element는 허용
// 새 shared UI 컴포넌트가 필요한 수준인데 임의 스타일의 native input을 반복 생성하는 것은 금지

// 11. schema를 컴포넌트 파일에 인라인 정의
const noticeFormSchema = z.object({ ... }); // 컴포넌트 파일 내 인라인 — 금지
type NoticeForm = z.infer<typeof noticeFormSchema>; // 금지
// → features/{feature}/schema/schema.ts로 분리
```

---

## 전체 구현 예시

```tsx
// features/notice-create/schema/schema.ts
import { z } from 'zod';

export const NoticeFormSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요.')
    .max(100, '100자 이내로 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
});

export type NoticeForm = z.infer<typeof NoticeFormSchema>;
```

```tsx
// features/notice-create/components/notice-create-form.tsx
'use client';

import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Button, Form, Input, Textarea } from '@/shared/components/ui';
import { PRIVATE, PUBLIC } from '@/shared/constants/route';
import { handleApiError } from '@/shared/lib/errors/error-handler';
import { classifyNoticeError } from '@/shared/lib/errors/errors';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateNotice } from '../hooks/use-create-notice';
import { NoticeForm, NoticeFormSchema } from '../schema/schema';

export const NoticeCreateForm = () => {
  const router = useRouter();
  const { mutate, isPending } = useCreateNotice();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm<NoticeForm>({
    resolver: zodResolver(NoticeFormSchema),
    mode: 'onChange',
    defaultValues: { title: '', content: '' },
  });

  const onSubmit = (data: NoticeForm) => {
    mutate(data, {
      onError: (error) => {
        handleApiError(error, classifyNoticeError, {
          onField: (msg) => setError('root', { message: msg }),
          onContext: () => setTimeout(() => router.replace(PRIVATE.NOTICE.LIST), 1500),
          onAuth: () => setTimeout(() => router.replace(PUBLIC.CORE.LOGIN), 1500),
          onUnknown: () => {},
        });
      },
    });
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Form.Item error={!!errors.title}>
        <Form.Label required>제목</Form.Label>
        <Form.Control>
          <Input
            {...register('title')}
            placeholder="제목을 입력해주세요."
          />
        </Form.Control>
        <Form.ErrorMessage>{errors.title?.message}</Form.ErrorMessage>
      </Form.Item>

      <Form.Item error={!!errors.content}>
        <Form.Label required>내용</Form.Label>
        <Form.Control>
          <Textarea
            {...register('content')}
            placeholder="내용을 입력해주세요."
          />
        </Form.Control>
        <Form.ErrorMessage>{errors.content?.message}</Form.ErrorMessage>
      </Form.Item>

      {errors.root?.message && (
        <p className="text-system-warning text-sm">{errors.root.message}</p>
      )}

      <Button
        type="submit"
        disabled={isPending || !isDirty || !isValid}
      >
        {isPending ? '저장 중...' : '저장'}
      </Button>
    </Form>
  );
};
```

---

## Validation Checklist

```
[ ] mutationFn은 repository 함수 호출 (api.private 직접 호출 금지)
[ ] onSuccess에 invalidateQueries 포함 (key factory 사용)
[ ] hook에 onError 없음 — 폼 컴포넌트의 mutate 호출부에서 처리 (GR004 warning은 폼 mutation hook에서 정상)
[ ] mutate(data, { onError }) 패턴 사용 (mutateAsync 남용 금지)
[ ] handleApiError에 onField → setError('root') 연결
[ ] errors.root 표시 영역이 폼에 존재
[ ] submit button에 isPending / isDirty / isValid 조건 포함
[ ] classify{Domain}Error가 errors.ts에 존재함
[ ] hook 파일이 features/ 에 위치함
[ ] schema가 features/{feature}/schema/schema.ts에 분리됨
[ ] Form / Form.Item / Form.Control / Form.ErrorMessage 사용 (원시 태그 금지)
[ ] router 경로에 PRIVATE / PUBLIC 상수 사용 (문자열 하드코딩 금지)
[ ] bash .ai/hooks/ai-check.sh 통과
```

---

## 참조

- `.ai/skills/create-post-mutation.md` — mutation hook 생성 (폼 없는 경우 포함)
- `.ai/skills/handle-api-error.md` — classifyXxxError 작성법, handleApiError 시그니처
- `.ai/skills/create-crud-flow.md` — repository / keys / DTO 생성 흐름
- `.ai/examples/crud-notice.md` — 실제 도메인 CRUD 전체 산출물
- `docs/error-handling.md` — 에러 레이어 원칙 (단, classify 함수 예시의 `return ApiErrorType.CONTEXT` 표기는 오류 — `ApiErrorType`은 type alias이므로 enum처럼 접근 불가. 실제 코드처럼 `return 'CONTEXT'` string literal로 작성할 것)
- `src/shared/lib/errors/errors.ts` — 기존 classify 함수 예시 (올바른 구현 참고)
- `src/shared/lib/errors/error-handler.ts` — handleApiError 구현

---

## AGENTS.md 연동

form mutation 생성 요청 시 이 skill을 먼저 참고할 것.
→ AGENTS.md의 AI Harness 테이블에 `create-form-mutation.md` 등록됨.
