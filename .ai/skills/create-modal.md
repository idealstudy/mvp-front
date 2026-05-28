# Skill: create-modal

## 역할

이 프로젝트에서 modal(Dialog)을 구현하는 방식을 정의하는 playbook이다.
이 문서는 Radix UI Dialog 설명서가 아니라 **이 프로젝트에서 modal을 일관되게 만드는 실행 규칙**이다.

---

## Trigger 조건

- "~~ modal 만들어줘 / 추가해줘"
- "~~ 삭제 확인 modal"
- "~~ 폼 modal"
- "~~ 안내 / alert modal"
- backdrop / ESC / close 동작을 포함하는 모든 overlay UI

---

## 이 Skill이 해결하는 문제

AI agent가 modal을 생성할 때 반복되는 실패 패턴:

- modal마다 open/close 방식이 달라지는 불일치 (`isOpen` vs `open` vs 내부 state)
- backdrop click / ESC 동작 누락 또는 destructive action에서 실수로 허용
- confirm/cancel 버튼 위치 불일치 (cancel이 오른쪽에 가거나, destructive가 강조 없이 렌더링)
- focus 관리 누락 (Radix가 자동 처리하지만 initial focus 지정 누락)
- mutation pending 중 modal 닫힘 허용, 중복 submit 가능 상태
- modal 성공 후 close timing 불일치 (invalidate 전 닫힘 vs 후 닫힘)
- modal 내부에서 `router.push` 직접 호출
- 새 primitive를 매번 직접 구현 (기존 `ConfirmDialog` / `InputDialog` 재사용 기회 놓침)

---

## 기본 원칙

### Hard Rules

- Feature 전용 modal을 `shared/components/dialog/ui/`에 추가하지 않는다.
- `Dialog.Content`에는 `Dialog.Title`을 포함한다 (빈 문자열이라도).
- mutation pending 중 confirm 버튼은 `disabled={isPending}` 처리한다.
- pending 중에는 ESC / backdrop / cancel / X 버튼으로 modal이 닫히거나 중복 처리가 발생하지 않게 한다.
- modal 내부에서 `router.push` / `router.replace`를 직접 호출하지 않는다.

### Defaults

- 단순 확인/삭제는 `ConfirmDialog`를 먼저 검토한다. 단, 현재 공용 `ConfirmDialog` / `InputDialog`는 pending 중 ESC/backdrop 차단을 지원하지 않는다. mutation pending 중 close 차단이 필요하면 feature 전용 modal을 작성한다.
- 새 modal은 부모에서 `isOpen` / `onClose`를 제어하는 controlled 형태를 기본으로 한다.
- cancel 버튼은 왼쪽 `variant="outlined"`, confirm 버튼은 오른쪽에 둔다.
- 삭제·탈퇴 등 destructive action은 경고 아이콘과 결과 문구를 명시한다.

### Exceptions

- 기존 feature에 하위 컴포넌트 구조가 있으면 주변 구조를 따른다.
- form modal의 error handling은 `create-form-mutation.md`를 우선한다. hook 내부 `onError`가 아닌 component의 `mutate(data, { onError })`에서 처리한다.
- URL 기반 modal은 공유 링크·새로고침 복원이 필요한 경우에만 사용한다.

---

## 생성 순서 (실행 절차)

### Step 1 — 기존 공용 modal 컴포넌트 확인

먼저 아래 컴포넌트로 해결 가능한지 확인한다.

```
src/shared/components/dialog/ui/
  confirm-dialog.tsx       ← 확인/삭제 확인 (variant: ok | confirm | confirm-cancel | delete)
  input-dialog.tsx         ← 텍스트 입력 + 저장
  studyroom-confirm-dialog.tsx  ← 스터디룸 전용 확인/삭제
```

- 단순 확인/삭제 → `ConfirmDialog` 재사용
- 텍스트 입력 → `InputDialog` 재사용
- 위 두 경우가 아닌 경우에만 새 modal 컴포넌트 생성

> **주의**: 현재 공용 `ConfirmDialog` / `InputDialog`는 `onInteractOutside` / `onEscapeKeyDown` 차단을 지원하지 않는다. mutation pending 중 backdrop/ESC로 닫히면 안 되는 경우에는 공용 dialog 재사용 대신 feature 전용 modal을 작성한다.

### Step 2 — open state 위치 결정

아래 기준으로 결정한다:

| 상황 | 방식 |
| ---- | ---- |
| 단순 boolean open/close | 부모 컴포넌트 `useState(false)` |
| 같은 화면에 여러 modal이 공존 | feature-local `useReducer`를 우선한다. `src/shared/components/dialog/model`의 `dialogReducer`는 해당 scope/kind가 이미 types.ts에 존재하는 경우에만 사용한다. 새 scope/kind를 shared types에 추가하지 않는다. |
| URL에 modal 상태를 반영해야 하는 경우 (공유 링크, 새로고침 유지) | searchParams 기반 (드문 경우만) |

### Step 3 — modal props 정의

controlled modal의 props 기본형:

```ts
type {Domain}ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  // confirm 액션이 있는 경우
  onConfirm?: () => void;
  // mutation pending 상태 주입
  isPending?: boolean;
};
```

mutation이 modal 외부에 있는 경우 `isPending`을 prop으로 주입한다.
mutation이 modal 내부에 있는 경우 내부에서 `isPending` 사용.

### Step 4 — Dialog 구조 조립

`Dialog.Content`에 `onInteractOutside` / `onEscapeKeyDown`으로 닫힘 정책을 적용한다.

```tsx
import { Dialog } from '@/shared/components/ui';

<Dialog isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>제목</Dialog.Title>
    </Dialog.Header>

    <Dialog.Body>
      {/* 본문 */}
    </Dialog.Body>

    <Dialog.Footer>
      <Button variant="outlined" onClick={onClose}>취소</Button>
      <Button onClick={onConfirm}>확인</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

### Step 5 — ESC / backdrop 정책 적용

mutation pending 중에만 닫힘을 막는다. destructive modal이 열려있는 것 자체는 ESC/backdrop 차단 이유가 아니다.

```tsx
<Dialog.Content
  onInteractOutside={(e) => {
    if (isPending) e.preventDefault();
  }}
  onEscapeKeyDown={(e) => {
    if (isPending) e.preventDefault();
  }}
>
```

일반 조회/안내 modal은 별도 처리 없이 Radix 기본 동작(ESC + backdrop → `onOpenChange` 호출)에 위임한다.

### Step 6 — confirm/cancel 액션 연결

```tsx
<Dialog.Footer>
  {/* cancel: 항상 왼쪽, outlined */}
  <Button variant="outlined" onClick={onClose} disabled={isPending}>
    취소
  </Button>
  {/* confirm: 항상 오른쪽 */}
  <Button onClick={onConfirm} disabled={isPending}>
    확인
  </Button>
</Dialog.Footer>
```

destructive action(삭제)의 경고 아이콘·버튼 스타일은 **confirm / cancel UX 규칙** 섹션을 참고한다.

### Step 7 — mutation/loading 상태 연결

**비폼 mutation (삭제·토글 등)**: hook 내부 `onError`에서 `handleApiError`를 처리하고, `onSuccess` 콜백을 파라미터로 받아 close를 위임한다.

```ts
// hooks/use-delete-{domain}.ts
export const useDelete{Domain} = ({
  onSuccess,
}: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: number) => repository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {domain}Keys.all }); // 예약 (비동기 완료를 기다리지 않음)
      onSuccess?.();
    },
    onError: (error) => {
      handleApiError(error, classify{Domain}Error, {
        onContext: () => setTimeout(() => router.replace(PRIVATE.{DOMAIN}.LIST), 1500),
        onAuth:    () => setTimeout(() => router.replace(PUBLIC.CORE.LOGIN), 1500),
        onUnknown: () => {},
      });
    },
  });
};
```

컴포넌트에서 사용:

```tsx
const { mutate, isPending } = useDelete{Domain}({ onSuccess: onClose });

<Button onClick={() => mutate(id)} disabled={isPending}>
  {isPending ? '삭제 중...' : '삭제'}
</Button>
```

**form modal**: hook 내부에 `onError`를 두지 않는다. `create-form-mutation.md`의 규칙에 따라 컴포넌트의 `mutate(data, { onError })`에서 `setError`와 `handleApiError`를 처리한다.

### Step 8 — close timing 검토

| 상황 | close 위치 |
| ---- | ---------- |
| 단순 확인 (조회/안내) | 버튼 클릭 시 즉시 `onClose()` |
| mutation 성공 후 close | hook `onSuccess` 내 `invalidateQueries()` 호출 이후 `onSuccess?.()` |
| mutation 성공 + redirect | component `mutate(data, { onSuccess })` — runtime param 의존 시 |
| mutation 실패 | modal 유지 — 에러를 modal 내부에 표시 |

---

## Dialog 구조 기준

`src/shared/components/ui/dialog.tsx`의 복합 컴포넌트를 기준으로 조합한다.

```
Dialog              ← isOpen, onOpenChange
  Dialog.Content    ← portal + overlay 포함. onInteractOutside, onEscapeKeyDown으로 정책 적용
    Dialog.Header   ← 제목 + 아이콘 영역
      Dialog.Title  ← Radix Title (aria-labelledby 자동 연결)
    Dialog.Body     ← 본문, scroll 허용
    Dialog.Footer   ← 버튼 영역
```

`Dialog.Description`은 부제목/설명 문구에 사용한다 (Radix `aria-describedby` 자동 연결).

X 닫기 버튼이 필요한 경우: pending 상태가 없는 modal은 `Dialog.Close`를 사용한다.

```tsx
<Dialog.Close asChild>
  <button type="button" aria-label="닫기">
    <XIcon size={24} />
  </button>
</Dialog.Close>
```

mutation이 있는 modal에서 X 버튼을 노출할 경우, `Dialog.Close`를 그대로 쓰면 pending 중에도 닫힌다. `isPending`이면 숨기거나 `disabled` 처리한다.

```tsx
{/* pending 중 숨기기 */}
{!isPending && (
  <Dialog.Close asChild>
    <button type="button" aria-label="닫기"><XIcon size={24} /></button>
  </Dialog.Close>
)}

{/* 또는 disabled 처리 */}
<button
  type="button"
  aria-label="닫기"
  onClick={onClose}
  disabled={isPending}
>
  <XIcon size={24} />
</button>
```

---

## open/close 상태 기준

### 좋은 예 — 부모에서 controlled

```tsx
// 부모 컴포넌트
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

<Button onClick={() => setIsDeleteModalOpen(true)}>삭제</Button>

<DeleteModal
  isOpen={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  targetId={selectedId}
/>
```

### 좋은 예 — 여러 modal 공존 시 feature-local useReducer (기본)

같은 화면에 여러 modal이 있을 때는 feature 안에서 직접 reducer를 정의한다.

```tsx
type ModalState = { type: 'idle' } | { type: 'delete'; id: number } | { type: 'edit'; id: number };
type ModalAction = { type: 'OPEN_DELETE'; id: number } | { type: 'OPEN_EDIT'; id: number } | { type: 'CLOSE' };

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case 'OPEN_DELETE': return { type: 'delete', id: action.id };
    case 'OPEN_EDIT':   return { type: 'edit',   id: action.id };
    case 'CLOSE':       return { type: 'idle' };
    default:            return state;
  }
};

// 컴포넌트
const [modal, dispatch] = useReducer(modalReducer, { type: 'idle' });

<DeleteModal
  isOpen={modal.type === 'delete'}
  onClose={() => dispatch({ type: 'CLOSE' })}
  targetId={modal.type === 'delete' ? modal.id : 0}
/>
```

### 참고 — 기존 shared scope/kind를 재사용하는 경우에만

`src/shared/components/dialog/model/types.ts`에 이미 해당 `scope`/`kind`가 정의되어 있는 경우에만 `dialogReducer`를 사용한다. **새 scope/kind를 shared types에 추가하지 않는다.**

```tsx
// 기존 scope/kind('note', 'delete')가 이미 types.ts에 있는 경우
const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);
const isMatch = useDialogMatcher(dialog);

dispatch({ type: 'OPEN', scope: 'note', kind: 'delete', payload: { noteId: 3 } });

<ConfirmDialog
  open={isMatch('note', 'delete')}
  dispatch={dispatch}
  variant="delete"
  onConfirm={() => deleteNote(dialog.status === 'open' ? dialog.payload?.noteId : undefined)}
/>
```

`dialogReducer`, `initialDialogState`, `useDialogMatcher`는 `src/shared/components/dialog`에서 import한다.

### 주의 — modal 내부에서 open state 자체 생성 남용 금지

```tsx
// 금지 — modal이 자신의 open 상태를 직접 관리
const MyModal = () => {
  const [isOpen, setIsOpen] = useState(false); // 내부 state

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>열기</Button>
      <Dialog isOpen={isOpen}>...</Dialog>
    </>
  );
};
// → 부모가 open 상태를 제어할 수 없어 테스트 및 재사용이 어려워짐
```

단, trigger와 modal이 항상 함께 존재하고 외부 제어가 불필요한 독립 UI 단위라면 허용.

### URL 기반 modal

로그인 후 복귀, 공유 링크 등 URL에 modal 상태를 반영해야 하는 경우만 사용.
일반 action modal에는 사용하지 않는다.

---

## confirm / cancel UX 규칙

### 버튼 배치

```
[취소 (outlined)]  [확인 / 저장 (secondary)]
```

- cancel: 항상 왼쪽, `variant="outlined"`
- confirm: 항상 오른쪽
- 단일 버튼(안내/ok modal): 가운데 정렬

### destructive action

삭제·취소 등 되돌릴 수 없는 행동은 다음을 포함한다:

- header에 경고 아이콘 + 원형 배경 (`bg-system-warning/10` + `text-system-warning`)
- 행동의 결과를 명시하는 부제목 ("삭제하면 복구할 수 없어요")
- confirm 버튼 텍스트를 행동 명사로 ("삭제", "탈퇴", "거절")

```tsx
// 좋은 예 (StudyroomClassLinksDeleteDialog 기준)
<div className="flex flex-col items-center gap-4">
  <div className="bg-system-warning/10 flex h-10 w-10 items-center justify-center rounded-full">
    <ExclamationIcon className="text-system-warning" />
  </div>
  <div className="flex flex-col items-center gap-2 text-center">
    <Dialog.Title>수업 링크를 삭제하시겠습니까?</Dialog.Title>
    <Dialog.Description>삭제하면 학생들에게 더 이상 링크가 노출되지 않습니다.</Dialog.Description>
  </div>
</div>
<Button variant="primary" onClick={onConfirm} disabled={isPending}>확인</Button>

// 나쁜 예 — 의도가 불분명
<Dialog.Title>확인</Dialog.Title>
<Button onClick={onConfirm}>확인</Button>
```

### loading 중 UX

```tsx
// confirm 버튼: pending 중 disabled + 텍스트 변경
<Button onClick={onConfirm} disabled={isPending}>
  {isPending ? '처리 중...' : '확인'}
</Button>

// cancel 버튼: pending 중 disabled (실수로 닫히는 것 방지)
<Button variant="outlined" onClick={onClose} disabled={isPending}>
  취소
</Button>
```

---

## ESC / backdrop 정책

### Radix 기본 동작

`Dialog`에 `onOpenChange`를 전달하면 Radix가 ESC 키와 backdrop click 모두를 `onOpenChange(false)` 호출로 처리한다.
별도 처리 없이 그대로 사용한다.

### ESC / backdrop 허용

```tsx
// 일반 조회 modal, 안내 modal, destructive confirm 전 단계
<Dialog isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
  <Dialog.Content>
    ...
  </Dialog.Content>
</Dialog>
```

### ESC / backdrop 차단 — mutation pending 중에만

```tsx
<Dialog isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
  <Dialog.Content
    onInteractOutside={(e) => {
      if (isPending) e.preventDefault();
    }}
    onEscapeKeyDown={(e) => {
      if (isPending) e.preventDefault();
    }}
  >
    ...
  </Dialog.Content>
</Dialog>
```

| 상황 | ESC | backdrop click |
| ---- | --- | -------------- |
| 일반 조회/안내 modal | 허용 | 허용 |
| destructive confirm 전 단계 (삭제 경고 modal) | 허용 | 허용 |
| mutation pending 중 | **차단** | **차단** |

---

## 접근성 기준

`Dialog`는 Radix UI 기반으로, 아래 항목이 **자동 처리**된다:

| 항목 | 처리 방식 |
| ---- | --------- |
| focus trap | Dialog.Content 내부로 Tab 이동 제한 |
| initial focus | Dialog.Content 마운트 시 첫 번째 포커스 가능 요소로 이동 |
| close 후 focus 복귀 | Dialog 닫힐 때 trigger 요소로 자동 복귀 |
| ESC keyboard 지원 | Radix 기본 제공 |
| aria-modal | `DialogContent`에 `aria-modal` 명시됨 |
| aria-labelledby | `Dialog.Title` 사용 시 자동 연결 |
| aria-describedby | `Dialog.Description` 사용 시 자동 연결 |

추가로 지켜야 할 항목:

- `Dialog.Title`은 반드시 포함한다 (빈 문자열이라도). 없으면 접근성 경고 발생.
- X 닫기 버튼에 `aria-label="닫기"` 필수
- 아이콘만 있는 버튼은 `aria-label` 또는 `sr-only` span 추가

initial focus를 특정 요소로 지정해야 하는 경우:

```tsx
// 첫 번째 버튼이 아닌 cancel 버튼에 초기 포커스를 줄 때
<Button
  variant="outlined"
  onFocus={(e) => e.currentTarget.focus()}
  autoFocus
  onClick={onClose}
>
  취소
</Button>
```

---

## body scroll lock 기준

Radix UI `Dialog`는 open 시 `document.body`에 `overflow: hidden`을 자동으로 적용한다.
별도 구현 불필요.

| 항목 | 처리 |
| ---- | ---- |
| background scroll 차단 | Radix 자동 처리 |
| nested modal | 지원하지 않음. modal 안에서 또 다른 modal을 열지 않는다. |
| mobile viewport | Radix가 처리하지만, iOS Safari에서 100dvh 이슈 발생 시 `max-h-[calc(100%-4rem)]` 조정 |

---

## mutation / loading 연동 기준

### 비폼 mutation hook 패턴 (삭제·토글 등)

Step 7과 동일한 패턴. hook 내부 `onError`에서 `handleApiError`를 처리하고, `onSuccess` 콜백으로 close를 위임한다.

```ts
// hooks/use-delete-{domain}.ts
export const useDelete{Domain} = ({
  onSuccess,
}: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: number) => repository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {domain}Keys.all });
      onSuccess?.();
    },
    onError: (error) => {
      handleApiError(error, classify{Domain}Error, {
        onContext: () => setTimeout(() => router.replace(PRIVATE.{DOMAIN}.LIST), 1500),
        onAuth:    () => setTimeout(() => router.replace(PUBLIC.CORE.LOGIN), 1500),
        onUnknown: () => {},
      });
    },
  });
};
```

```tsx
// modal 컴포넌트
const { mutate, isPending } = useDelete{Domain}({ onSuccess: onClose });
```

### 성공 후 close timing

`invalidateQueries`는 Promise를 반환하지만 await하지 않는다. "invalidate를 예약한 뒤 close"하는 것이 기본 패턴이다. close보다 먼저 호출하는 것만 보장한다.

```ts
// 좋은 예 — invalidate 예약 후 close
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: {domain}Keys.all }); // 예약 (완료를 기다리지 않음)
  onSuccess?.();                                                  // close
},

// 나쁜 예 — close 후 invalidate
onSuccess: () => {
  onSuccess?.();
  queryClient.invalidateQueries({ queryKey: {domain}Keys.all }); // 닫힌 후 갱신 — 순서 역전
},
```


---

## 파일 위치

```
src/features/{feature}/
  components/
    {domain}-delete-modal.tsx    ← feature 전용 modal
    {domain}-edit-modal.tsx

src/shared/components/
  ui/
    dialog.tsx                   ← Dialog primitive (수정 금지)
  dialog/
    ui/
      confirm-dialog.tsx         ← 공용 confirm/delete modal
      input-dialog.tsx           ← 공용 input modal
    model/
      dialog-reducer.ts          ← useReducer용 reducer
      use-dialog-matcher.ts      ← scope+kind 매칭 훅
      types.ts                   ← DialogState, DialogAction, DialogScope, DialogKind
```

신규 feature modal은 기본적으로 `src/features/{feature}/components/`에 위치한다.
기존 feature에 하위 UI 도메인 폴더가 있으면 주변 구조를 따른다.
단, feature 전용 modal을 `shared/components/dialog/ui/`에 추가하지 않는다.

---

## Anti-patterns

아래 패턴이 보이면 즉시 수정한다.

```tsx
// 1. modal 내부에서 open state 생성 + trigger 자체 포함 (재사용 불가)
const DeleteModal = () => {
  const [isOpen, setIsOpen] = useState(false);  // 금지 — 부모에서 제어
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>삭제</Button>
      <Dialog isOpen={isOpen}>...</Dialog>
    </>
  );
};

// 2. mutation pending 중 backdrop/ESC 차단 없음
<Dialog isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
  <Dialog.Content>  {/* isPending 중에도 onInteractOutside/onEscapeKeyDown 차단 없음 — 금지 */}
    <Button onClick={handleDelete}>삭제</Button>
  </Dialog.Content>
</Dialog>

// 3. pending 중 중복 submit 가능
<Button onClick={onConfirm}>  {/* disabled={isPending} 없음 — 금지 */}
  삭제
</Button>

// 4. ESC로 mutation 중 modal 종료
<Dialog.Content>  {/* onEscapeKeyDown 차단 없음, isPending 상태에서 — 금지 */}

// 5. close 후 focus 복귀 없음 → Radix가 자동 처리하므로, trigger가 없는 경우 직접 ref로 복귀 관리
// trigger 없이 `Dialog`를 programmatic하게 열 때 Radix가 복귀 대상을 찾지 못할 수 있음

// 6. modal 내부에서 router.push 직접 처리
const handleConfirm = () => {
  router.push(PRIVATE.NOTICE.LIST);  // 금지 — 부모 또는 hook onSuccess에서 처리
  onClose();
};

// 7. cancel/confirm 위치 불일치
<Dialog.Footer>
  <Button onClick={onConfirm}>확인</Button>     {/* confirm이 왼쪽 — 금지 */}
  <Button variant="outlined" onClick={onClose}>취소</Button>
</Dialog.Footer>

// 8. Dialog.Title 없이 Dialog.Content 사용 (접근성 위반)
<Dialog.Content>
  <Dialog.Header>
    {/* Dialog.Title 없음 — 금지 */}
    <p>내용</p>
  </Dialog.Header>
</Dialog.Content>

// 9. close 전에 invalidate (데이터 갱신 전 닫힘)
onSuccess: () => {
  onClose();
  queryClient.invalidateQueries({ queryKey: {domain}Keys.all }); // 금지 — 순서 역전
},

// 10. pending close 차단이 필요 없고 공용 ConfirmDialog로 충분한데 새 컴포넌트 생성
// variant="delete" / "confirm"으로 해결되고 pending 중 ESC/backdrop 차단도 불필요한 경우 → ConfirmDialog 재사용
// pending 중 close 차단이 필요한 경우 → feature 전용 modal이 맞는 선택
```

---

## 전체 구현 예시

### 단순 삭제 confirm modal (feature 전용)

```tsx
// features/notice/components/delete-notice-modal.tsx
'use client';

import { ExclamationIcon } from '@/shared/components/icons';
import { Dialog } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/button';

import { useDeleteNotice } from '../hooks/use-delete-notice';

type DeleteNoticeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  noticeId: number;
};

export const DeleteNoticeModal = ({
  isOpen,
  onClose,
  noticeId,
}: DeleteNoticeModalProps) => {
  const { mutate, isPending } = useDeleteNotice({ onSuccess: onClose });

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(open) => { if (!open) onClose(); }}
    >
      <Dialog.Content
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        <Dialog.Header className="flex-col items-center gap-4">
          <div className="bg-system-warning/10 flex size-10 items-center justify-center rounded-full">
            <ExclamationIcon className="text-system-warning" />
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Dialog.Title>공지를 삭제하시겠어요?</Dialog.Title>
            <Dialog.Description>삭제한 공지는 복구할 수 없어요.</Dialog.Description>
          </div>
        </Dialog.Header>

        <Dialog.Footer className="mt-6 justify-center gap-3">
          <Button
            variant="outlined"
            className="w-[120px]"
            size="xsmall"
            onClick={onClose}
            disabled={isPending}
          >
            취소
          </Button>
          <Button
            className="w-[120px]"
            size="xsmall"
            onClick={() => mutate(noticeId)}
            disabled={isPending}
          >
            {isPending ? '삭제 중...' : '삭제'}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
```

```ts
// features/notice/hooks/use-delete-notice.ts
import { noticeKeys, repository } from '@/entities/notice';
import { handleApiError } from '@/shared/lib/errors/error-handler';
import { classifyNoticeError } from '@/shared/lib/errors/errors';
import { PRIVATE, PUBLIC } from '@/shared/constants/route';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useDeleteNotice = ({
  onSuccess,
}: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: number) => repository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
      onSuccess?.();
    },
    onError: (error) => {
      handleApiError(error, classifyNoticeError, {
        onContext: () => setTimeout(() => router.replace(PRIVATE.NOTICE.LIST), 1500),
        onAuth:    () => setTimeout(() => router.replace(PUBLIC.CORE.LOGIN), 1500),
        onUnknown: () => {},
      });
    },
  });
};
```

```tsx
// 부모 컴포넌트에서 사용
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [targetId, setTargetId] = useState<number | null>(null);

const handleDeleteClick = (id: number) => {
  setTargetId(id);
  setIsDeleteModalOpen(true);
};

<DeleteNoticeModal
  isOpen={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  noticeId={targetId ?? 0}
/>
```

### 공용 ConfirmDialog로 처리 가능한 경우

mutation pending 중 ESC/backdrop close 차단이 필요 없는 단순 확인/안내에만 사용한다.
pending 중 close 차단이 필요한 mutation(삭제 등)에는 feature 전용 modal을 작성한다.

```tsx
// 단순 확인 (mutation 없거나, pending close 차단 불필요한 경우)
import { ConfirmDialog } from '@/shared/components/dialog';

<ConfirmDialog
  open={isOpen}
  dispatch={dispatch}
  variant="confirm-cancel"
  title="제출하시겠어요?"
  description="제출 후에는 수정할 수 없어요."
  onConfirm={onConfirm}
/>
```

---

## Validation Checklist

자동 검증 (`bash .ai/hooks/ai-check.sh`):
```
[ ] bash .ai/hooks/ai-check.sh 통과
```

코드 리뷰에서 확인 (자동 검증 불가):
```
[ ] 기존 ConfirmDialog / InputDialog로 해결 가능한지 먼저 확인
[ ] open state는 부모 컴포넌트에서 제어 (controlled)
[ ] Dialog.Title 포함 (빈 문자열이라도)
[ ] cancel 왼쪽 outlined / confirm 오른쪽
[ ] destructive action: 경고 아이콘 (bg-system-warning/10 + text-system-warning) + 결과 문구 포함
[ ] mutation pending 중 confirm + cancel 버튼 disabled={isPending}
[ ] mutation pending 중 onEscapeKeyDown + onInteractOutside 차단
[ ] close timing: invalidateQueries 호출 이후에 onSuccess?.() 위치 (await 불필요)
[ ] modal 내부에서 router.push 직접 호출 없음
[ ] X 닫기 버튼 사용 시 aria-label="닫기" 포함
[ ] feature 전용 modal을 shared/components/dialog/ui/에 추가하지 않음
[ ] form modal은 create-form-mutation.md error handling 규칙을 따름
```

---

## 참조

- `src/shared/components/ui/dialog.tsx` — Dialog primitive (Radix UI 기반)
- `src/shared/components/dialog/` — 공용 modal 컴포넌트 및 dialog state 관리
- `src/features/invite/components/invite-exit-modal.tsx` — destructive confirm modal 예시
- `src/features/invite/components/invite-login-modal.tsx` — 단순 안내 modal 예시
- `.ai/skills/create-post-mutation.md` — 폼 없는 mutation hook (삭제 등)
- `.ai/skills/create-form-mutation.md` — modal 내 폼 mutation 흐름
- `.ai/skills/handle-api-error.md` — mutation onError 처리

---

## AGENTS.md 연동

modal 생성 요청 시 이 skill을 먼저 참고할 것.
→ AGENTS.md의 AI Harness 테이블에 `create-modal.md` 등록됨.
