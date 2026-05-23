# AI Diagnostics Contract — v1.0

`.ai/hooks/ai-check.sh` 실행 시 두 가지 출력을 생성한다:

- **콘솔**: human-readable 진행 상황 (개발자용 UX)
- **`.ai/tmp/diagnostics.json`**: machine-readable structured diagnostics (AI agent 소비용)

이 문서는 `diagnostics.json`의 스키마와 사용 규칙을 정의한다.

---

## 생성 위치

```
.ai/tmp/diagnostics.json
```

`.ai/tmp/` 디렉토리는 `.gitignore`에 등록되어 있다. 커밋되지 않는 임시 출력물이다.

---

## schemaVersion

현재 버전: `"1.0"`

스키마 구조가 변경될 경우 버전을 올린다. AI agent는 읽기 전 버전을 확인할 것을 권장한다.

---

## 최상위 구조

```json
{
  "schemaVersion": "1.0",
  "status": "passed | failed",
  "summary": { ... },
  "diagnostics": [ ... ]
}
```

---

## status

| 값 | 조건 |
| --- | --- |
| `"passed"` | `diagnostics` 배열에 `severity: "error"` 항목이 없음 |
| `"failed"` | `severity: "error"` 항목이 1개 이상 존재 |

`warning` / `info` 항목만 있으면 `status`는 `"passed"`.

---

## summary

```json
{
  "errors": 2,
  "warnings": 1,
  "infos": 0
}
```

각 severity별 individual diagnostic 수. 검사 단위가 아닌 항목 단위로 집계한다.

---

## diagnostics 배열

각 항목의 필드:

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `ruleId` | string | 규칙 식별자 (GR001–GR010). 안정적 suppression key |
| `ruleName` | string | 규칙 이름 (snake_case) |
| `category` | string | 규칙 분류 (아래 목록 참고) |
| `severity` | string | `error` / `warning` / `info` |
| `file` | string | 위반 파일 경로 (없으면 `""`) |
| `line` | number \| null | 위반 라인 번호 (특정 불가 시 `null`) |
| `message` | string | 위반 설명 |
| `suggestion` | string | 수정 방향 힌트 (없으면 `""`) |
| `docs` | string[] | 참고 문서 경로 목록 |

### category 목록

| 값 | 설명 |
| --- | --- |
| `architecture` | FSD 레이어 위반, deprecated client 사용 |
| `react-query` | TanStack Query 사용 패턴 |
| `mutation` | mutation hook 패턴 |
| `error-handling` | API 에러 처리 패턴 |
| `validation` | payload 유효성 검사 |
| `typescript` | TypeScript 타입 오류 |
| `eslint` | ESLint 규칙 위반 |

---

## severity 기준

| severity | 의미 | exit code 영향 |
| --- | --- | --- |
| `error` | 반드시 수정해야 하는 위반 | exit 1 (실패) |
| `warning` | 권장 수정. 현재는 막지 않음 | exit 0 |
| `info` | 참고용 관찰. 수정 불필요 | exit 0 |

---

## exit code 정책

| 조건 | exit code |
| --- | --- |
| error 0개 | `0` (통과) |
| error 1개 이상 | `1` (실패) |

warning / info 만 있으면 항상 exit 0.

---

## 예시 JSON

### 통과 (no violations)

```json
{
  "schemaVersion": "1.0",
  "status": "passed",
  "summary": {
    "errors": 0,
    "warnings": 0,
    "infos": 0
  },
  "diagnostics": []
}
```

### 실패 (error + warning 혼재)

```json
{
  "schemaVersion": "1.0",
  "status": "failed",
  "summary": {
    "errors": 1,
    "warnings": 1,
    "infos": 0
  },
  "diagnostics": [
    {
      "ruleId": "GR001",
      "ruleName": "no_api_private",
      "category": "architecture",
      "severity": "error",
      "file": "src/features/quiz/hooks/use-quiz.ts",
      "line": 12,
      "message": "features에서 API 클라이언트 직접 사용",
      "suggestion": "API 호출을 entities/{domain}/infrastructure/{domain}.repository.ts 로 이동하세요",
      "docs": ["docs/architecture.md"]
    },
    {
      "ruleId": "GR004",
      "ruleName": "require_handle_api_error",
      "category": "error-handling",
      "severity": "warning",
      "file": "src/features/quiz/hooks/use-create-quiz.ts",
      "line": null,
      "message": "handleApiError 미사용",
      "suggestion": "폼 없는 액션: 훅 내부 onError에 추가. 폼 있는 mutation: 컴포넌트 mutate() onError에서 처리",
      "docs": [".ai/skills/create-post-mutation.md"]
    }
  ]
}
```

---

## Repair Loop 안내

AI agent는 검사 실패 시 이 파일을 읽고 스스로 수정 후 재실행한다 (AGENTS.md Rule 7).

절차:

1. `status: "failed"` 확인
2. `diagnostics` 배열에서 `severity: "error"` 항목 추출
3. `ruleId` / `file` / `line` 기준으로 **minimal patch** 적용
4. `bash .ai/hooks/ai-check.sh` 재실행
5. `status: "passed"` 될 때까지 반복

console output은 개발자가 실시간으로 확인하는 human-readable UX이며,
`diagnostics.json`은 AI agent가 구조적으로 실패를 분석하는 machine-readable contract이다.
