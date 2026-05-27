# UI Guidelines

AI 에이전트 및 개발자가 새 코드를 작성할 때 따라야 할 UI 코딩 규칙입니다.

> **범위**: 새 코드에만 적용됩니다. 기존 코드는 건드리지 않으며, 버그 수정 시에는 주변 코드의 컨벤션을 따릅니다.

---

## 1. `page.tsx`는 최대한 얇게

`page.tsx`는 레이아웃 조합과 데이터 전달만 담당합니다. 상태, 핸들러, 조건 렌더링 로직은 feature 컴포넌트로 분리합니다.

```tsx
// Good
export default async function SomePage() {
  return (
    <main>
      <SomeFeatureClient data={MOCK_DATA} />
    </main>
  );
}

// Bad — 상태와 핸들러가 page.tsx 안에 있음
export default function SomePage() {
  const [selected, setSelected] = useState(null);
  return <div onClick={() => setSelected(...)}>...</div>;
}
```

## 2. `page.tsx`는 서버 컴포넌트로 유지

`page.tsx`에 `'use client'`를 추가하지 않습니다. 클라이언트 상태가 필요하면 `*-client.tsx` 래퍼 컴포넌트를 만들어 분리합니다.

```tsx
// page.tsx (서버 컴포넌트)
export default async function SomePage() {
  const data = await fetchData();
  return <SomeFeatureClient initialData={data} />;
}

// some-feature-client.tsx
'use client';
export const SomeFeatureClient = ({ initialData }) => {
  const [state, setState] = useState(initialData);
  ...
};
```

## 3. 패스스루 `layout.tsx` 생성 금지

`<>{children}</>` 만 반환하는 layout 파일은 만들지 않습니다. Next.js는 layout 파일이 없어도 동일하게 동작합니다.

```tsx
// Bad — 이 파일은 필요 없음
export default function SomeLayout({ children }) {
  return <>{children}</>;
}
```

## 4. 목데이터는 별도 파일로 관리

목데이터는 `src/features/{domain}/mock/` 디렉터리에 `.ts` 파일로 분리합니다. `page.tsx` 또는 컴포넌트 파일 내 인라인 선언 금지.

```
src/features/open-challenge/mock/
  challenges.ts          # 목록 페이지용
  challenge-detail.ts    # 상세 페이지용
  challenge-result.ts    # 결과 페이지용
```

## 5. 기존 공통 컴포넌트 재사용

버튼, 인풋, 모달, 텍스트에어리어 등은 직접 구현하지 않고 `@/shared/components/ui`에서 import합니다. 아래 카탈로그를 먼저 확인하세요.

| 컴포넌트                                   | 용도                                                   |
| ------------------------------------------ | ------------------------------------------------------ |
| `Button`                                   | 모든 클릭 액션 버튼                                    |
| `Input`                                    | 단순 텍스트 입력                                       |
| `TextField`                                | 폼용 텍스트 입력 (레이블 포함)                         |
| `Textarea`                                 | 여러 줄 텍스트 입력                                    |
| `Select`                                   | 드롭다운 선택 (폼용 기본 / 필터용 `h-[36px]` override) |
| `SearchInput`                              | 검색 입력                                              |
| `Checkbox`                                 | 체크박스                                               |
| `RadioGroup` / `RadioCard`                 | 라디오 선택                                            |
| `Form` / `Form.Item` / `Form.ErrorMessage` | RHF 폼 래퍼                                            |
| `Dialog`                                   | 모달/다이얼로그                                        |
| `Accordion`                                | 아코디언                                               |
| `DropdownMenu`                             | 드롭다운 메뉴                                          |
| `Pagination`                               | 페이지네이션                                           |
| `StatusBadge`                              | 상태 뱃지                                              |
| `Toggle`                                   | 토글 스위치                                            |
| `TagInput`                                 | 태그 입력                                              |
| `Prompt`                                   | 확인/취소 프롬프트                                     |

로딩 컴포넌트는 `@/shared/components/loading`에서 import.

| 컴포넌트         | 용도                      |
| ---------------- | ------------------------- |
| `Skeleton.Block` | 리스트/카드 로딩 스켈레톤 |
| `MiniSpinner`    | 인라인 로딩 스피너        |

```tsx
// Bad — 직접 구현
<button className="rounded bg-orange-7 px-4 py-2 text-white">제출</button>

// Good
import { Button } from '@/shared/components/ui';
<Button>제출</Button>
```

## 6. 이모지 대신 `lucide-react` 아이콘 사용

UI 아이콘은 이모지 문자 대신 `lucide-react`를 사용합니다. 프로젝트에 이미 설치되어 있습니다.

```tsx
// Bad
<span className="text-2xl">🔥</span>

// Good
import { Flame } from 'lucide-react';
<Flame size={24} className="text-orange-7" />
```

주요 아이콘 매핑:

| 이모지 | lucide 아이콘    |
| ------ | ---------------- |
| 🔥     | `Flame`          |
| 👤     | `User`           |
| 🤖     | `Bot`            |
| 👍     | `ThumbsUp`       |
| 🎁     | `Gift`           |
| ✓      | `Check`          |
| ✗      | `X`              |
| 📊     | `BarChart2`      |
| 🗑     | `Trash2`         |
| ✏     | `Pencil`         |
| ⌫      | `Eraser`         |
| 🔖     | `Bookmark`       |
| ⋯      | `MoreHorizontal` |
| ⚠     | `AlertTriangle`  |
| ★      | `Star`           |

## 7. 색상은 3.0 디자인 시스템 우선

3.0 토큰(`orange-1`~`orange-12`, `gray-1`~`gray-12`)을 우선 사용하고, 없을 경우에만 2.0 시맨틱 토큰을 사용합니다.

| 용도             | 3.0 토큰 (우선)   | 2.0 토큰 (대체)              |
| ---------------- | ----------------- | ---------------------------- |
| 주요 색상 배경   | `bg-orange-7`     | `bg-key-color-primary`       |
| 주요 색상 텍스트 | `text-orange-7`   | `text-key-color-primary`     |
| 연한 주황 배경   | `bg-orange-1`     | `bg-background-orange`       |
| 보조 텍스트      | `text-gray-8`     | `text-gray-scale-gray-60`    |
| 비활성 텍스트    | `text-gray-6`     | `text-gray-scale-gray-40`    |
| 아이콘 배경      | `bg-gray-1`       | `bg-gray-scale-gray-5`       |
| hover 배경       | `hover:bg-gray-1` | `hover:bg-gray-scale-gray-1` |

## 8. 버튼에 `cursor-pointer` 적용

공통 `Button` 컴포넌트는 자동 적용되지만, Tailwind preflight가 브라우저 기본 커서를 초기화하므로 직접 구현한 `<button>`에는 반드시 `cursor-pointer`를 추가합니다.

```tsx
// Bad
<button onClick={handleClick} className="rounded-full px-4 py-2">
  클릭
</button>

// Good
<button onClick={handleClick} className="cursor-pointer rounded-full px-4 py-2">
  클릭
</button>
```

## 9. 경로는 route 상수 사용

경로 문자열을 하드코딩하지 않고 `@/shared/constants/route`의 `PUBLIC` / `PRIVATE` 상수를 사용합니다.

```tsx
import { PUBLIC, PRIVATE } from '@/shared/constants/route';

// Bad
<Link href="/open-challenge">챌린지</Link>
router.push(`/study-rooms/${id}/note`);

// Good
<Link href={PUBLIC.CORE.OPEN_CHALLENGE}>챌린지</Link>
router.push(PRIVATE.NOTE.LIST(id));
```

동적 경로는 상수에 함수로 정의되어 있습니다 (`PRIVATE.ROOM.DETAIL(id)` 등).

## 10. `<a>` 태그 대신 `<Link>` 사용

명확한 이유(외부 URL, `target="_blank"` 등)가 없으면 `next/link`의 `<Link>`를 사용합니다.

```tsx
// Good
import Link from 'next/link';
<Link href={PUBLIC.CORE.OPEN_CHALLENGE}>목록으로</Link>

// Bad
<a href="/open-challenge">목록으로</a>
```

## 11. 의미 있는 변수명

한 글자 변수명은 지양합니다. 이벤트 핸들러 파라미터, 배열 콜백 변수 모두 포함됩니다.

```tsx
// Bad
onChange={(e) => setValue(e.target.value)}
subjects.map((s) => <Tab key={s.value} />)

// Good
onChange={(event) => setValue(event.target.value)}
subjects.map((subject) => <Tab key={subject.value} />)
```

## 12. 기본 반응형 대응

레이아웃이 모바일에서 깨지지 않도록 최소한의 반응형을 적용합니다.

- 다단 컬럼 레이아웃: 모바일에서는 단일 컬럼으로 (`flex-col lg:flex-row`)
- 가로 스크롤이 생기지 않도록 `min-w-0`, `overflow-hidden` 사용
- 고정 너비(`w-[Npx]`)는 모바일에서 `w-full lg:w-[Npx]`로 처리

```tsx
// Bad — 모바일에서 overflow 발생
<div className="flex gap-6">
  <div className="flex-1">콘텐츠</div>
  <aside className="w-[340px]">사이드</aside>
</div>

// Good
<div className="flex flex-col gap-6 lg:flex-row">
  <div className="min-w-0 flex-1">콘텐츠</div>
  <aside className="w-full lg:w-[340px] lg:shrink-0">사이드</aside>
</div>
```

## 13. 기존 UI와 융화

새로 만드는 컴포넌트는 프로젝트의 기존 디자인 톤과 맞춰야 합니다.

- 모서리: `rounded-xl` (카드), `rounded-lg` (버튼/입력), `rounded-full` (태그/뱃지)
- 테두리: `border border-line-line1` (기본), `border-line-line2` (약한 구분선)
- 배경: `bg-white` (카드), `bg-gray-1` (비활성/hover)
- 새 패턴이 필요하면 `src/features/community` 또는 `src/features/study-notes` 등 기존 feature를 먼저 참고

## 14. 로딩 · 빈 상태 패턴

**로딩 상태**: `isPending` 또는 `isLoading`일 때 `Skeleton.Block`으로 대체합니다.

```tsx
import { Skeleton } from '@/shared/components/loading';

if (isLoading) return (
  <div className="flex flex-col gap-3">
    <Skeleton.Block className="h-20 w-full" />
    <Skeleton.Block className="h-20 w-full" />
  </div>
);
```

**빈 상태**: 데이터가 없을 때 아이콘 + 텍스트로 표시합니다.

```tsx
if (items.length === 0) return (
  <div className="border-line-line1 flex flex-col items-center gap-2 rounded-xl border bg-white py-16 text-center">
    <Inbox size={36} className="text-gray-6" />
    <p className="font-body1-heading text-text-main">데이터가 없어요.</p>
  </div>
);
```

## 15. 텍스트 말줄임

한 줄 말줄임은 `truncate`, 여러 줄은 `line-clamp-{n}`을 사용합니다.

```tsx
// 한 줄
<p className="truncate">{longTitle}</p>

// 3줄
<p className="line-clamp-3">{longContent}</p>
```

## 16. 기본 접근성 (a11y)

**아이콘 전용 버튼**: 텍스트 없이 아이콘만 있는 버튼에는 반드시 `aria-label`을 추가합니다.

```tsx
// Bad
<button onClick={handleDelete}><Trash2 size={16} /></button>

// Good
<button onClick={handleDelete} aria-label="삭제"><Trash2 size={16} /></button>
```

**클릭 가능한 요소**: 클릭 핸들러는 반드시 `<button>` 또는 `<Link>`에 붙입니다. `<div onClick>` 사용 금지.

```tsx
// Bad
<div onClick={handleClick}>클릭</div>

// Good
<button onClick={handleClick}>클릭</button>
```

**이미지**: Next.js `<Image>`의 `alt`는 항상 의미 있게 작성합니다. 장식용이면 `alt=""`.

```tsx
<Image src={src} alt="프로필 사진" />   // 의미 있는 이미지
<Image src={icon} alt="" />              // 장식용
```

## 17. 불필요한 래퍼 금지

로직이나 스타일을 추가하지 않는 래퍼는 만들지 않습니다. 컴포넌트든 훅이든 동일합니다.

```tsx
// Bad — 아무것도 안 하는 컴포넌트 래퍼
const Wrapper = ({ children }) => <div>{children}</div>;

// Bad — 자식이 하나뿐인 불필요한 Fragment
return (
  <>
    <OnlyChild />
  </>
);
// Good
return <OnlyChild />;

// Bad — 가공 없이 그대로 위임하는 훅
const useMyData = () => {
  const result = useOtherHook();
  return result;
};
// Good — useOtherHook()을 직접 사용
```

래퍼가 필요한 경우: 레이아웃·스타일 추가, Context 제공, 에러 바운더리, 로직 조합.
