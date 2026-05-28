# Skill: create-editor-feature

## 역할

이 프로젝트에서 Tiptap 기반 에디터 기능을 구현하는 방식을 정의하는 playbook이다.

---

## Trigger 조건

- "에디터 기능 만들어줘"
- "Tiptap 에디터 붙여줘"
- "글 작성/수정 폼 만들어줘"
- "TextEditor / TextViewer 사용해서 보여줘"
- "내용 저장 payload 만들어줘"
- content를 입력·수정·조회하는 모든 폼/뷰 컴포넌트

---

## 이 Skill이 해결하는 문제

AI agent가 에디터 기능을 구현할 때 반복되는 실패 패턴:

- 새 Tiptap primitive를 직접 구현하거나 feature마다 별도 에디터 컴포넌트 생성
- `prepareContentForSave` 없이 raw JSONContent를 그대로 API payload로 전송
- feature마다 content stringify / parse를 직접 구현
- 이미지 업로드 중 submit을 막지 않아 업로드 중인 이미지가 누락된 채 저장
- 조회 화면에서 `JSON.parse`를 직접 사용하거나 content fallback 처리 누락
- feature-local editor/upload handler에서 `api.private` / `api.public` 직접 호출
- editor state와 form state를 중복 관리
- autosave를 요청 없이 임의로 추가

---

## 기본 원칙

| 규칙                                  | 설명                                                                                                                                                                                                                                         |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 기존 에디터 컴포넌트 우선             | 새 editor primitive 직접 구현 금지. `src/shared/components/editor`의 `TextEditor` / `TextViewer` 재사용                                                                                                                                      |
| 유틸 함수 먼저 검색                   | content stringify / parse 유틸을 새로 만들기 전에 반드시 기존 유틸을 검색할 것                                                                                                                                                               |
| feature에서 저장 API 직접 호출 금지   | feature 컴포넌트에서 `api.private` / `api.public`로 content 저장/수정 API 직접 호출 금지. repository + mutation hook 경유. 단, `src/shared/components/editor` 내부의 기존 미디어 업로드 구현은 공용 editor 인프라로 간주하며 재구현하지 않음 |
| content 변환은 유틸 경유              | payload 생성·viewer 파싱에서 `JSON.stringify` / `JSON.parse` 직접 사용 금지. `prepareContentForSave` / `parseEditorContent` 우선 사용. 단, 글자 수 계산을 위한 `extractText(JSON.stringify(value))`는 허용                                   |
| form/mutation layer 책임 분리         | editor는 content 입력만 담당. submit은 form / mutation layer의 책임                                                                                                                                                                          |
| 이미지 업로드 중 submit 방지          | `isUploading` 상태를 확인해 submit button을 disabled 처리                                                                                                                                                                                    |
| autosave는 요청 시에만 구현           | 명시적으로 요청받은 경우에만 구현. 에디터 기능 구현 시 임의로 추가하지 말 것                                                                                                                                                                 |
| editor 내 toast/router 직접 처리 금지 | 성공 후 redirect/close/reset은 feature layer에서 처리                                                                                                                                                                                        |

---

## 생성 순서 (실행 절차)

### Step 1 — 기존 editor 컴포넌트와 유틸 확인

`src/shared/components/editor` 하위 파일을 먼저 확인한다.

```
src/shared/components/editor/
  index.ts          ← public entrypoint. 모든 import는 여기서만
  ui/
    text-editor.tsx ← 작성/수정용
    text-viewer.tsx ← 조회용
  utils/
    index.ts        ← prepareContentForSave, parseEditorContent 등
  model/
    initial-state.ts ← initialTextEditorValue
    use-image-upload.ts
    use-auto-save.ts
    ...
```

import는 반드시 `@/shared/components/editor`에서만 한다. 내부 경로 직접 import 금지.

새 유틸이 필요하다고 판단되면, **먼저 `utils/index.ts`를 검색**해 이미 있는지 확인한다.

### Step 2 — TextEditor / TextViewer 사용 위치 결정

| 컴포넌트     | 사용 시점                                                     |
| ------------ | ------------------------------------------------------------- |
| `TextEditor` | 작성 / 수정 폼 — `Controller`로 감싸 form과 연결              |
| `TextViewer` | 조회 화면 — `parseEditorContent`로 변환한 값을 `value`에 전달 |

### Step 3 — content schema 작성

신규 feature는 schema를 `features/{feature}/schema/schema.ts`에 분리한다.
기존 feature 수정 시에는 주변 폴더 구조(예: `schemas/`, `components/write/schemas/`)를 따른다.
→ 아래 `content schema 작성 기준` 섹션 참고

### Step 4 — form defaultValues 설정

```ts
defaultValues: {
  content: initialTextEditorValue,
}
```

수정 폼은 아래 `form defaultValues 기준` 섹션 참고.

### Step 5 — TextEditor를 Controller로 연결

`TextEditor`는 Tiptap JSONContent 타입을 사용하므로 반드시 `Controller`로 감싼다.

```tsx
<Controller
  name="content"
  control={control}
  render={({ field }) => {
    const length = extractText(JSON.stringify(field.value)).length;
    return (
      <>
        <TextEditor
          value={field.value}
          onChange={field.onChange}
          placeholder="내용을 입력해주세요."
          minHeight="400px"
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-system-warning text-sm">
            {typeof errors.content?.message === 'string' &&
              errors.content.message}
          </p>
          <span
            className={cn(
              length > 3000 ? 'text-system-warning' : 'text-gray-5'
            )}
          >
            {length} / 3000
          </span>
        </div>
      </>
    );
  }}
/>
```

### Step 6 — submit 시 prepareContentForSave 적용

```ts
const onSubmit = (data: Form) => {
  const { contentString, mediaIds } = prepareContentForSave(data.content);
  mutate({ ...data, content: contentString, mediaIds });
};
```

### Step 7 — mutation hook 연결

→ `.ai/skills/create-form-mutation.md` 패턴 참고

### Step 8 — 이미지 업로드 중 submit disabled 처리

→ 아래 `이미지 업로드 중 submit 비활성화` 섹션 참고

### Step 9 — loading / error UX 연결

→ 아래 `loading / error UX 기준` 섹션 참고

### Step 10 — 조회 화면에 TextViewer 사용

→ 아래 `viewer 사용 기준` 섹션 참고

---

## 기존 editor 유틸 사용 패턴

경로: `src/shared/components/editor`

| 함수                                 | 용도                                                    |
| ------------------------------------ | ------------------------------------------------------- |
| `initialTextEditorValue`             | form `defaultValues`의 content 초기값                   |
| `prepareContentForSave(jsonContent)` | 저장 전 변환 → `{ contentString, mediaIds }`            |
| `parseEditorContent(string)`         | 문자열 → `JSONContent` 변환 (조회용)                    |
| `extractText(JSON.stringify(val))`   | JSONContent에서 순수 텍스트 추출 (글자 수 카운트)       |
| `hasNonTextContent(val)`             | 이미지/파일 등 비텍스트 첨부 여부 확인 (`@/shared/lib`) |

> 이 목록 외에도 유틸이 추가되어 있을 수 있다.
> 새 유틸을 만들기 전 반드시 `src/shared/components/editor/utils/index.ts` 또는 `@/shared/components/editor` export를 먼저 확인할 것.

---

## content schema 작성 기준

신규 feature는 schema를 `features/{feature}/schema/schema.ts`에 분리한다.
기존 feature 수정 시에는 주변 폴더 구조를 따른다.

### 기본 (텍스트만)

```ts
import { extractText } from '@/shared/lib';
import { JSONContent } from '@tiptap/react';
import { z } from 'zod';

const contentSchema = z.custom<JSONContent>().superRefine((val, ctx) => {
  const length = extractText(JSON.stringify(val)).trim().length;

  if (length < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '내용을 입력해주세요.',
    });
  }

  if (length > 3000) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '3000자 이상은 입력하실 수 없습니다.',
    });
  }
});
```

### 첨부 파일도 유효한 내용으로 허용하는 경우

```ts
import { extractText, hasNonTextContent } from '@/shared/lib';

if (length < 1 && !hasNonTextContent(val)) {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: '내용 또는 첨부 파일을 입력해 주세요.',
  });
}
```

---

## form defaultValues 기준

### 작성 폼

```ts
const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  mode: 'onChange',
  defaultValues: {
    content: initialTextEditorValue,
  },
});
```

### 수정 폼

API에서 받은 content string을 `parseEditorContent`로 변환 후 `reset`으로 주입한다.
`setValue`는 `isDirty` 기준이 초기화되지 않으므로 사용하지 않는다.

```ts
useEffect(() => {
  if (data) {
    reset({
      content: parseEditorContent(
        data.resolvedContent?.content ?? data.content
      ),
    });
  }
}, [data, reset]);
```

---

## submit payload 기준

```ts
const onSubmit = (data: Form) => {
  const { contentString, mediaIds } = prepareContentForSave(data.content);

  mutate({
    ...data,
    content: contentString,
    mediaIds,
  });
};
```

- editor JSONContent를 그대로 API payload로 보내지 말 것
- `JSON.stringify` 직접 사용보다 `prepareContentForSave` 우선
- API payload shape은 repository / domain schema 기준에 맞출 것

---

## 이미지 업로드 중 submit 비활성화

이미지 업로드 중 submit이 가능하면 업로드 중인 이미지가 누락된 채 저장된다.
반드시 아래 패턴을 적용한다.

```tsx
const hasUploadingNode = (node: JSONContent): boolean => {
  if (node.attrs?.isUploading === true) return true;
  return (node.content ?? []).some(hasUploadingNode);
};

const content = watch('content');
const isUploading = useMemo(() => hasUploadingNode(content), [content]);

// 작성 폼
<Button type="submit" disabled={isPending || !isValid || isUploading}>
  {isPending ? '저장 중...' : '저장'}
</Button>

// 수정 폼 — !isDirty 추가
<Button type="submit" disabled={isPending || !isDirty || !isValid || isUploading}>
  {isPending ? '수정 중...' : '수정'}
</Button>;
```

| 조건          | 이유                                               |
| ------------- | -------------------------------------------------- |
| `isPending`   | mutation 진행 중 중복 제출 방지                    |
| `!isDirty`    | 변경사항 없으면 제출 불필요 — **수정 폼에만 적용** |
| `!isValid`    | schema 검증 통과 전 제출 방지                      |
| `isUploading` | 이미지 업로드 중 content 누락 방지                 |

---

## viewer 사용 기준

조회 화면에서는 `TextViewer`와 `parseEditorContent`를 사용한다.
`JSON.parse`를 직접 사용하지 않는다.

```tsx
import { TextViewer, parseEditorContent } from '@/shared/components/editor';

// resolvedContent가 항상 보장되는 경우 (DTO nullable 아님)
const content = parseEditorContent(data.resolvedContent.content);

// resolvedContent가 없을 수도 있는 경우
const content = parseEditorContent(data.resolvedContent?.content ?? data.content);

<TextViewer value={content} />
```

content fallback 기준은 API 응답의 nullable 여부에 맞춘다.

---

## loading / error UX 기준

- 저장 중 `isPending`으로 중복 submit 방지
- 이미지 업로드 중 `isUploading`으로 submit 방지
- 저장 실패 시 `mutate(data, { onError })`의 `onError`에서 `handleApiError` 처리
- editor 내부에서 toast / router 직접 처리 금지
- 성공 후 redirect / close / reset은 feature layer에서 처리 (hook `onSuccess` 또는 component `mutate onSuccess`)

→ `handleApiError` 위치 규칙은 `.ai/skills/create-form-mutation.md` 참고

---

## DTO 패턴

```ts
const ResolvedContentSchema = z.object({
  content: z.string(),
  expiresAt: z.string().nullable(),
});

// 조회 응답에 추가
resolvedContent: ResolvedContentSchema,          // 항상 있는 경우
resolvedContent: ResolvedContentSchema.nullish(), // 없을 수도 있는 경우

// 등록/수정 payload에 추가
mediaIds: z.array(z.string()).optional(),
```

---

## 파일 위치 예시

```
src/shared/components/editor/
  index.ts           ← public entrypoint. 모든 import는 여기서만
  ui/
    text-editor.tsx
    text-viewer.tsx
  utils/
    index.ts
  model/
    initial-state.ts

src/entities/{domain}/
  infrastructure/
    {domain}.repository.ts    ← create / update 함수 (content: string, mediaIds 포함)
    {domain}.dto.ts            ← ResolvedContentSchema, mediaIds 포함 payload schema

src/features/{feature}/
  schema/
    schema.ts                  ← {Domain}FormSchema (contentSchema 포함) + type {Domain}Form
  hooks/
    use-create-{domain}.ts     ← mutation hook (onError 없이)
    use-update-{domain}.ts
  components/
    {domain}-create-form.tsx   ← TextEditor + prepareContentForSave + isUploading 처리
    {domain}-edit-form.tsx
    {domain}-detail.tsx        ← TextViewer + parseEditorContent
```

---

## Anti-patterns

아래 패턴이 보이면 즉시 수정한다.

```tsx
// 1. 새 Tiptap editor primitive 직접 구현
import { useEditor, EditorContent } from '@tiptap/react'; // 금지 — TextEditor 재사용

// 2. feature별 에디터 컴포넌트 별도 생성
// features/notice/components/notice-editor.tsx ← 금지 — TextEditor 재사용

// 3. feature-local editor/upload handler에서 API 직접 호출
const MyEditor = () => {
  const handleImageUpload = async (file: File) => {
    await api.private.post('/upload', file); // 금지 — feature에서 업로드 API를 재구현하지 말고 기존 shared editor 업로드 흐름을 사용
  };
};

// 4. prepareContentForSave 없이 raw JSONContent 저장
mutate({ content: JSON.stringify(data.content) }); // 금지 — prepareContentForSave 사용

// 5. feature마다 content stringify/parse 직접 구현
const contentString = JSON.stringify(editorContent); // 금지 — prepareContentForSave 사용
const editorContent = JSON.parse(contentString);     // 금지 — parseEditorContent 사용

// 6. 이미지 업로드 중 submit 가능 (isUploading 조건 누락)
disabled={isPending || !isValid} // 금지 — isUploading 조건 누락

// 7. editor state와 form state 중복 관리
const [editorContent, setEditorContent] = useState(initialTextEditorValue); // 금지 — Controller로 form state로만 관리

// 8. viewer에서 JSON.parse 직접 사용
const content = JSON.parse(data.content); // 금지 — parseEditorContent 사용
<TextViewer value={content} />

// 9. editor 내부에서 toast/router 직접 처리
const handleSave = async () => {
  await save();
  router.push(PRIVATE.NOTICE.LIST); // 금지 — feature layer에서 처리
  toast.success('저장되었습니다.');  // 금지
};

// 10. autosave 임의 추가 (요청받지 않은 경우 금지)
useEffect(() => {
  const timer = setInterval(() => save(), 30000); // 금지 — 명시적으로 요청받은 경우에만 구현
  return () => clearInterval(timer);
}, []);

// 11. placeholder 하드코딩 반복 (공통 props가 있는 경우)
// → TextEditor의 placeholder prop으로 전달
```

---

## 전체 구현 예시

### 작성 폼

`features/notice-create/schema/schema.ts`

```tsx
import { extractText } from '@/shared/lib';
import { JSONContent } from '@tiptap/react';
import { z } from 'zod';

const contentSchema = z.custom<JSONContent>().superRefine((val, ctx) => {
  const length = extractText(JSON.stringify(val)).trim().length;

  if (length < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '내용을 입력해주세요.',
    });
  }
  if (length > 3000) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '3000자 이상은 입력하실 수 없습니다.',
    });
  }
});

export const NoticeFormSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요.')
    .max(100, '100자 이내로 입력해주세요.'),
  content: contentSchema,
});

export type NoticeForm = z.infer<typeof NoticeFormSchema>;
```

`features/notice-create/components/notice-create-form.tsx`

```tsx
'use client';

import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import {
  TextEditor,
  initialTextEditorValue,
  prepareContentForSave,
} from '@/shared/components/editor';
import { Button, Form, Input } from '@/shared/components/ui';
import { PRIVATE, PUBLIC } from '@/shared/constants/route';
import { extractText } from '@/shared/lib';
import { cn } from '@/shared/lib';
import { handleApiError } from '@/shared/lib/errors/error-handler';
import { classifyNoticeError } from '@/shared/lib/errors/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { JSONContent } from '@tiptap/react';

import { useCreateNotice } from '../hooks/use-create-notice';
import { NoticeForm, NoticeFormSchema } from '../schema/schema';

const hasUploadingNode = (node: JSONContent): boolean => {
  if (node.attrs?.isUploading === true) return true;
  return (node.content ?? []).some(hasUploadingNode);
};

export default function NoticeCreateForm() {
  const router = useRouter();
  const { mutate, isPending } = useCreateNotice();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm<NoticeForm>({
    resolver: zodResolver(NoticeFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      content: initialTextEditorValue,
    },
  });

  const content = watch('content');
  const isUploading = useMemo(() => hasUploadingNode(content), [content]);

  const onSubmit = (data: NoticeForm) => {
    const { contentString, mediaIds } = prepareContentForSave(data.content);

    mutate(
      { title: data.title, content: contentString, mediaIds },
      {
        onError: (error) => {
          handleApiError(error, classifyNoticeError, {
            onField: (msg) => setError('root', { message: msg }),
            onContext: () =>
              setTimeout(() => router.replace(PRIVATE.NOTICE.LIST), 1500),
            onAuth: () =>
              setTimeout(() => router.replace(PUBLIC.CORE.LOGIN), 1500),
            onUnknown: () => {},
          });
        },
      }
    );
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
        <Controller
          name="content"
          control={control}
          render={({ field }) => {
            const length = extractText(JSON.stringify(field.value)).length;
            return (
              <>
                <TextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="내용을 입력해주세요."
                  minHeight="400px"
                />
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-system-warning text-sm">
                    {typeof errors.content?.message === 'string' &&
                      errors.content.message}
                  </p>
                  <span
                    className={cn(
                      length > 3000 ? 'text-system-warning' : 'text-gray-5'
                    )}
                  >
                    {length} / 3000
                  </span>
                </div>
              </>
            );
          }}
        />
      </Form.Item>

      {errors.root?.message && (
        <p className="text-system-warning text-sm">{errors.root.message}</p>
      )}

      <Button
        type="submit"
        disabled={isPending || !isValid || isUploading}
      >
        {isPending ? '저장 중...' : '저장'}
      </Button>
    </Form>
  );
}
```

### 조회 화면

`features/notice-detail/components/notice-detail.tsx`

```tsx
import { TextViewer, parseEditorContent } from '@/shared/components/editor';

type Props = { data: Notice };

export const NoticeDetail = ({ data }: Props) => {
  // resolvedContent가 항상 보장되는 경우
  const content = parseEditorContent(data.resolvedContent.content);

  // resolvedContent가 없을 수도 있는 경우
  // const content = parseEditorContent(data.resolvedContent?.content ?? data.content);

  return <TextViewer value={content} />;
};
```

---

## Validation Checklist

```
[ ] src/shared/components/editor 하위 기존 유틸 먼저 확인
[ ] TextEditor는 Controller로 감싸 form state와 연결
[ ] form defaultValues에 initialTextEditorValue 사용
[ ] onSubmit에서 prepareContentForSave 적용 (raw JSONContent 직접 전송 금지)
[ ] isUploading 조건이 submit button disabled에 포함됨
[ ] submit button: 작성 폼 `isPending || !isValid || isUploading` / 수정 폼 `isPending || !isDirty || !isValid || isUploading`
[ ] 조회 화면에서 parseEditorContent 사용 (JSON.parse 직접 사용 금지)
[ ] TextViewer에 parseEditorContent 변환값 전달
[ ] content fallback은 DTO nullable 여부 기준으로 처리
[ ] feature 사용처에서 content 저장/수정 API를 직접 호출하지 않음 (repository + mutation hook 경유)
[ ] shared editor 내부 기존 미디어 업로드 구현을 feature별로 재구현하지 않음
[ ] editor 내부에서 toast / router 직접 처리 없음
[ ] autosave는 요청받은 경우에만 구현 (임의 추가 금지)
[ ] DTO에 mediaIds: z.array(z.string()).optional() 포함
[ ] 신규 feature는 schema가 `features/{feature}/schema/schema.ts`에 분리됨 (기존 feature 수정 시 주변 schema 폴더 구조를 따름)
[ ] bash .ai/hooks/ai-check.sh 통과
```

---

## 참조

- `src/shared/components/editor/` — TextEditor, TextViewer, 유틸 함수 전체
- `.ai/skills/create-form-mutation.md` — mutation hook + handleApiError 위치 규칙
- `.ai/skills/create-post-mutation.md` — mutation hook 생성 (폼 없는 경우 포함)
- `.ai/skills/handle-api-error.md` — classifyXxxError 작성법, handleApiError 시그니처
- `.ai/skills/create-crud-flow.md` — repository / keys / DTO 생성 흐름

---

## AGENTS.md 연동

editor, TextEditor, TextViewer, Tiptap, content 저장/조회 관련 요청 시 이 skill을 먼저 참고할 것.
→ AGENTS.md의 AI Harness 테이블에 `create-editor-feature.md` 등록됨.
