# Skill: create-query-hook

## 역할

`useQuery` 기반 데이터 조회 hook을 이 프로젝트 아키텍처에 맞게 생성한다.
이 문서는 React Query 튜토리얼이 아니라 **이 프로젝트 전용 생성 절차**다.

---

## Trigger 조건

- "~~ 조회 hook 만들어줘"
- "~~ 목록 / 상세 가져오는 훅 추가해줘"
- `create-crud-flow` skill 이후 query hook 단계로 진입하는 경우

---

## 기본 원칙 (신규 query hook 생성 시 반드시 준수)

| 규칙                     | 설명                                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| repository 경유 필수     | `queryFn` 안에서 API client를 직접 호출하지 않고 repository 함수만 호출한다                                          |
| key factory 필수         | `queryKey` 배열 리터럴 하드코딩 금지 — 반드시 `{domain}Keys.xxx()` 사용                                              |
| domain 변환은 repository | DTO → domain 변환은 repository에서 완료되어야 함. hook이나 select에서 하지 않음                                      |
| hook 위치                | 신규 query hook은 `features/{feature}/hooks/`에 작성. `entities/*/hooks`는 기존 예외만 유지하고 신규 생성하지 않는다 |
| select 원칙              | 기본적으로 사용하지 않는다. 변환이 필요하면 repository 반환 타입을 먼저 수정한다                                     |

---

## 생성 순서

### Step 1 — repository 함수 확인 / 생성

`entities/{domain}/infrastructure/{domain}.repository.ts` 에 필요한 함수가 있는지 확인.
없으면 필요한 GET 함수, DTO, key만 최소 생성한다.
전체 CRUD(POST/PUT/DELETE 포함)가 명시적으로 요청된 경우에만 `create-crud-flow` skill을 실행한다.

```ts
// entities/notice/infrastructure/notice.repository.ts
const getNotice = async (id: number) => {
  const response = await api.private.get(`/notices/${id}`);
  return unwrapEnvelope(response, dto.detail);
};

const getNoticeList = async (params: { page: number; size: number }) => {
  const response = await api.private.get('/notices', { params });
  return unwrapEnvelope(response, dto.list);
};
```

### Step 2 — query key 확인 / 생성

`entities/{domain}/infrastructure/{domain}.keys.ts` 에 key factory가 있는지 확인.
없으면 아래 패턴으로 생성한다.

```ts
// entities/notice/infrastructure/notice.keys.ts
export const noticeKeys = {
  all: ['notice'] as const,
  detail: (id: number) => [...noticeKeys.all, 'detail', id] as const,
  list: (params: { page: number; size: number }) =>
    [...noticeKeys.all, 'list', params] as const,
};
```

**명명 규칙:**

- 신규 도메인: `{domain}Keys` camelCase 사용 (`noticeKeys`, `teacherKeys`, `memberKeys`)
- 기존 도메인이 이미 `{Domain}QueryKey` PascalCase를 쓰고 있다면 (e.g. `TeacherHomeworkQueryKey`, `ClassLinkQueryKey`), 그 이름을 따른다 — 같은 도메인에 `{domain}Keys`를 새로 만들면 key 충돌이 생김

**key factory 설계 규칙:**

- 파라미터 전체를 key에 포함해야 캐시가 올바르게 분리됨
- `invalidateQueries`도 동일 key factory로 호출할 것
- key factory 외부에서 spread + 추가 항목 붙이지 말 것 (`[...noticeKeys.list(), page, size]` 금지 — 파라미터는 factory 안으로)
- 기본값이 있는 필드는 key factory 안에서 정규화한다 — 누락·`undefined`·기본값이 혼재하면 같은 요청이 다른 캐시로 분리됨

```ts
// 정규화 예시 — 기본값이 있는 필드는 factory 안에서 확정
list: (params: { page: number; size: number; sortKey?: string; keyword?: string }) =>
  [
    ...noticeKeys.all,
    'list',
    params.page,
    params.size,
    params.sortKey ?? 'LATEST',
    params.keyword ?? '',
  ] as const,
```

### Step 3 — query hook 생성

신규 query hook은 **`features/{feature}/hooks/`** 에 작성한다.
`entities/{domain}/hooks/`에는 새 query hook을 추가하지 않는다. 이미 존재하는 `entities/member/hooks/`는 레거시 전역 core hook으로 유지만 한다.

```ts
// features/{feature}/hooks/use-{domain}-list-query.ts
import { {domain}Keys, repository } from '@/entities/{domain}';
import { useQuery } from '@tanstack/react-query';

export const use{Domain}ListQuery = (params: { page: number; size: number }, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: {domain}Keys.list(params),
    queryFn: () => repository.getList(params),
    enabled: options?.enabled,
  });
```

상세 조회:

```ts
// features/{feature}/hooks/use-{domain}-detail-query.ts
export const use{Domain}DetailQuery = (id: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: {domain}Keys.detail(id),
    queryFn: () => repository.getDetail(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
```

**repository namespace:**

도메인에 따라 repository가 flat이거나 nested일 수 있다. 기존 파일 구조를 확인하고 따른다.

```ts
// flat repository (단순 도메인)
queryFn: () => repository.getList(params);

// nested namespace (역할/용도별 분리된 도메인)
queryFn: () => repository.teacher.getList(params);
queryFn: () => repository.dashboard.getReport();
queryFn: () => repository.notification.getList();
```

### Step 4 — enabled / staleTime 검토

아래 기준을 참고해 각 옵션을 결정한다.

---

## enabled 기준

**enabled 필요한 경우:**

```ts
// id가 없을 수 있는 경우 (route param, modal props)
enabled: !!id;

// 더 엄격한 검증이 필요한 경우
enabled: typeof id === 'number' && Number.isInteger(id) && id > 0;

// modal이 열렸을 때만 fetch
enabled: isOpen;

// 복수 조건 — 모두 만족해야 할 때
enabled: (options?.enabled ?? true) && hasValidStudentId && hasValidStudyRoomId;

// auth/session 준비 여부
enabled: initialHasSession;
```

**role 기반 enabled — 이 프로젝트에서 자주 쓰이는 패턴:**

role 값은 `useMemberStore`에서 가져온다. (`useAuth()`는 로그인/로그아웃 액션 허브 — role 조회 용도 아님)
역할값: `'ROLE_TEACHER'` / `'ROLE_STUDENT'` / `'ROLE_PARENT'`

```ts
import { useMemberStore } from '@/store';

const member = useMemberStore((s) => s.member);
const isTeacher = member?.role === 'ROLE_TEACHER';

// 선생님 전용 데이터
const { data: teacherData } = useTeacherDashboardReportQuery({
  enabled: isTeacher,
});

// 학생 전용 데이터
const { data: studentData } = useStudentDashboardReportQuery({
  enabled: member?.role === 'ROLE_STUDENT',
});

// 부모 전용 데이터
const { data: parentData } = useParentDashboardReportQuery({
  enabled: member?.role === 'ROLE_PARENT',
});

// role + id 복합 조건
enabled: isTeacher && studyRoomId > 0;
```

hook 내부에서 외부 조건을 수용하는 패턴:

```ts
export const useTeacherDashboardReportQuery = (options?: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: teacherKeys.dashboard.report(),
    queryFn: () => teacherRepository.dashboard.getReport(),
    enabled: options?.enabled, // undefined이면 TanStack Query가 true로 처리
  });
};
```

> **`?? true` 필요 여부**:
>
> - 단순 조건 `enabled: options?.enabled` — `?? true` 불필요. `undefined`일 때 TanStack Query가 자동으로 `true`로 처리.
> - 복합 조건에서는 `(options?.enabled ?? true) && condition` 형태를 반드시 사용한다.
>   `options?.enabled && condition`으로 쓰면 `options`가 없을 때 `undefined && condition = undefined`가 되어 TanStack Query가 enabled로 처리 — 의도와 반대로 조건 없이 실행될 수 있다.

**enabled 불필요한 경우:**

```ts
// 페이지 진입 시 항상 필요한 데이터
useQuery({
  queryKey: noticeKeys.list(params),
  queryFn: () => repository.getNoticeList(params),
  // enabled 생략
});
```

enabled 없이 `undefined` id로 요청하면 API 400이 발생한다. id가 optional이면 반드시 enabled 추가.

---

## select 기준

기본적으로 `select`를 사용하지 않는다.
domain 변환·DTO flattening·비즈니스 계산은 repository 책임이므로, `select`가 필요하다고 느껴지면 repository의 반환 타입을 먼저 수정한다.

컴포넌트 표시 전용의 가벼운 projection(필드 하나만 뽑기 등)은 예외로 허용하되, domain 의미를 바꾸지 않는 경우에만 해당한다.

---

## staleTime 기준

숫자를 강제하지 않는다. 아래 판단 기준으로 결정한다.

| 데이터 성격                                            | staleTime   | 이유                            |
| ------------------------------------------------------ | ----------- | ------------------------------- |
| 세션 내 거의 안 바뀌는 참조 데이터 (회원 정보, 프로필) | 길게 (5분+) | 불필요한 refetch 방지           |
| 사용자 액션으로 자주 바뀌는 데이터 (목록, 상태)        | 기본값 (0)  | mutation 후 invalidate로 최신화 |
| 실시간성이 중요한 데이터 (알림, 채팅)                  | 0 또는 생략 | 항상 최신 상태 필요             |
| 외부 변경이 없는 정적 참조 데이터                      | `Infinity`  | 앱 실행 중 절대 안 바뀜         |

```ts
const FIVE_MINUTES = 1000 * 60 * 5;

// 세션 내 안 바뀌는 회원 정보
queryOptions({
  queryKey: memberKeys.info(),
  queryFn: repository.member.getMember,
  staleTime: FIVE_MINUTES,
  retry: false,
  enabled: initialHasSession,
});
```

---

## 파일 위치

```
src/entities/notice/
  infrastructure/
    notice.repository.ts     ← API 호출 + DTO 파싱
    notice.keys.ts           ← query key factory
    notice.dto.ts            ← Zod DTO 스키마
  index.ts                   ← 공개 API re-export

src/features/notice-management/
  hooks/
    use-notice-detail-query.ts
    use-notice-list-query.ts
```

> 신규 query hook은 `features/`에 작성한다.
> `entities/*/hooks`는 기존 예외만 유지하고 새로 만들지 않는다.

---

## Anti-patterns

```ts
// 1. feature hook 내부 API 직접 호출
export const useNoticeDetail = (id: number) =>
  useQuery({
    queryKey: ['notice', id],
    queryFn: () => api.private.get(`/notices/${id}`), // 금지 — repository 경유할 것
  });

// 2. queryKey 하드코딩
queryKey: ['notice']             // 금지
queryKey: ['notice', 'detail', id] // 금지 — noticeKeys.detail(id) 사용

// 3. key factory 외부에서 배열 확장
queryKey: [...noticeKeys.list(), page, size] // 금지 — params를 factory 안으로

// 4. enabled 없이 undefined id 요청
queryFn: () => repository.getNotice(id), // id가 undefined면 API 400
// → enabled: !!id 추가

// 5. select에서 business transform
select: (data) => data.items.map(transformDomain) // 금지 — repository 책임

// 6. useQuery 안에서 toast
queryFn: async () => {
  const data = await repository.getNotice(id);
  toast.success('불러왔습니다'); // 금지 — 사이드이펙트는 컴포넌트에서
  return data;
},

// 7. repository 우회 후 Zod 수동 파싱
queryFn: async () => {
  const res = await api.private.get(`/notices/${id}`);
  return dto.detail.parse(res.data.result); // 금지 — repository가 이미 처리
},
```

---

## 참조

- role 기반 enabled 패턴: `src/features/dashboard/hooks/use-dashboard-query.ts`
  - `useTeacherDashboardReportQuery`, `useParentDashboardReportQuery` — `options?.enabled` 단순 조건 참고
  - `useParentDashboardStudyNewsQuery`, `useParentDashboardStudyConsultationQuery` — 복수 id 검증 + 복합 조건 참고
  - ⚠️ `queryKey`를 key factory 외부에서 spread 확장하는 레거시 패턴 — 복사 금지
- `queryOptions` 헬퍼로 options 객체를 분리하는 패턴 (prefetch/SSR 재사용 목적): `src/entities/member/hooks/use-member-query.ts`
- CRUD 전체 흐름: `.ai/skills/create-crud-flow.md`
- mutation hook: `.ai/skills/create-post-mutation.md`

---

## AGENTS.md 연동

query hook 생성 요청 시 이 skill을 먼저 참고할 것.
→ AGENTS.md의 AI Harness 테이블에 `create-query-hook.md` 등록됨.
