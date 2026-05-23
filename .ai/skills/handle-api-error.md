# Skill: handle-api-error

## 역할

mutation의 `onError`에 표준 에러 처리를 연결한다.
새 도메인을 추가할 때 `classifyXxxError` 함수를 `errors.ts`에 등록하고
mutation hook의 `onError`에서 `handleApiError`로 호출하는 전체 흐름을 완성한다.

---

## Trigger 조건

- 새 도메인 mutation hook을 작성할 때
- "에러 처리 추가해줘"
- `onError`가 비어있거나 `console.error`만 있는 경우
- `create-crud-flow` / `create-post-mutation` skill 실행 중 에러 처리 단계

---

## 에러 처리 레이어 요약

| 레이어                    | 처리 주체                 | 대상                    |
| ------------------------- | ------------------------- | ----------------------- |
| 인터셉터 (자동)           | `api.private` 인터셉터    | 네트워크 오류, 5xx, 401 |
| mutation `onError` (수동) | 개발자 → `handleApiError` | 4xx 비즈니스 에러       |

> 5xx / 401 / 네트워크 오류는 인터셉터가 토스트 + 리다이렉트를 자동 처리한다.
> `onError`에서 이 케이스를 다시 처리하지 않는다.

---

## Step 1 — classifyXxxError 함수 추가

파일: `src/shared/lib/errors/errors.ts`

기존 classify 함수 목록 아래에 추가한다. 절대 별도 파일 생성 금지.

```ts
// {domain} 관련 에러
export function classify{Domain}Error(code?: string): ApiErrorType {
  switch (code) {
    // FIELD: 사용자가 입력값을 고쳐서 해결 가능
    case '{DOMAIN}_DUPLICATE_TITLE':
    case '{DOMAIN}_INVALID_INPUT':
      return 'FIELD';

    // CONTEXT: 리소스 소멸 / 페이지가 더 이상 유효하지 않음
    case '{DOMAIN}_NOT_FOUND':
    case '{DOMAIN}_ALREADY_DELETED':
    case 'STUDY_ROOM_NOT_EXIST':
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

**에러 코드 분류 결정 트리**

```
"사용자가 입력을 바꿔서 해결할 수 있는가?" → YES → FIELD
"리소스가 삭제되었거나 페이지가 무효한가?" → YES → CONTEXT
"권한이 없거나 다시 로그인해야 하는가?"   → YES → AUTH
그 외 모든 경우                           → UNKNOWN
```

백엔드 에러 코드가 아직 확정되지 않았으면 `default: return 'UNKNOWN'` 만 작성하고 이후에 채운다.

---

## Step 2 — handleApiError 호출

파일: `features/{feature}/hooks/use-create-{domain}.ts` (또는 다른 mutation hook)

```ts
import { classify{Domain}Error } from '@/shared/lib/errors/errors';
import { handleApiError } from '@/shared/lib/errors/error-handler';

// mutation onError:
onError: (error) => {
  handleApiError(error, classify{Domain}Error, {
    onField:   (msg) => setError('root', { message: msg }),
    onContext: ()    => router.replace('/{domain}s'),
    onAuth:    ()    => router.replace('/login'),
    onUnknown: ()    => {},
  });
},
```

**각 handler의 기본 동작**

| 타입        | 기본 동작                       | 언제 사용                            |
| ----------- | ------------------------------- | ------------------------------------ |
| `onField`   | `setError('root', { message })` | 폼이 있고 사용자가 수정할 수 있을 때 |
| `onContext` | `router.replace('/목록')`       | 리소스가 없거나 페이지 무효          |
| `onAuth`    | `router.replace('/login')`      | 권한 없음                            |
| `onUnknown` | 빈 함수 `() => {}`              | Sentry가 자동 캡처함                 |

> `handleApiError` 내부에서 에러 토스트를 자동 출력한다.
> `onError`에서 별도로 `toast.error()`를 호출하지 않는다.

---

## 폼 없는 mutation의 onField 처리

폼이 없는 단순 버튼 액션(좋아요, 상태 변경 등)은 `onField`를 생략하거나 빈 함수:

```ts
handleApiError(error, classify{Domain}Error, {
  onContext: () => router.replace('/{domain}s'),
  onAuth:    () => router.replace('/login'),
});
```

---

## Step 3 — errors.ts import 확인

`errors.ts`에서 export한 함수를 mutation hook에서 import할 때 경로:

```ts
import { classify{Domain}Error } from '@/shared/lib/errors/errors';
import { handleApiError } from '@/shared/lib/errors/error-handler';
```

---

## Validation Checklist

```
[ ] classify{Domain}Error가 errors.ts에 추가됨 (별도 파일 생성 금지)
[ ] switch-case에 FIELD / CONTEXT / AUTH / UNKNOWN 분류 포함
[ ] handleApiError가 onError 내에서 호출됨
[ ] onError에서 5xx / 401 / 네트워크 에러를 수동으로 처리하지 않음
[ ] toast.error() 등 중복 토스트 호출 없음
[ ] npm run check-types 통과
```

---

## 실제 프로젝트 예시 참조

`src/shared/lib/errors/errors.ts` — 기존 classify 함수 패턴 확인
`src/shared/lib/errors/error-handler.ts` — handleApiError 시그니처 확인

---

## Retrieval Docs

- `docs/error-handling.md` — 에러 레이어 원칙, 전체 흐름
- `src/shared/lib/errors/errors.ts` — 기존 classify 함수 예시
- `src/shared/lib/errors/error-handler.ts` — handleApiError 구현
