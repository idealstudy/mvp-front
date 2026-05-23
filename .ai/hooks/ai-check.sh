#!/bin/bash
# AI Guardrails Check — v0.2 "Structured Diagnostics"
# 사용법: bash .ai/hooks/ai-check.sh
#
# 목적: AI agent가 생성한 신규 코드의 레이어 위반을 감지한다.
# 범위: 신규 코드 기준. 기존 레거시 코드(features/auth, features/study-notes 등)는
#       AGENTS.md "Do not refactor existing code" 원칙에 따라 검사 제외.
# 출력:
#   - 콘솔: human-readable 진행 상황
#   - .ai/tmp/diagnostics.json: machine-readable structured diagnostics (AI consumption 최적화)
#     → Codex/Claude/Cursor 등 agent가 실패 원인과 수정 위치를 읽는 repair input

set -e

# ── Rule ID Reference ─────────────────────────────────────────────────────────
# GR001  no_api_private              features에서 api.private/public 직접 사용     [architecture]
# GR002  no_query_key_hardcode       queryKey 배열 리터럴 하드코딩                 [react-query]
# GR003  require_invalidate_queries  mutation onSuccess에 invalidateQueries 누락   [mutation]
# GR004  require_handle_api_error    handleApiError 미사용 (warning)               [error-handling]
# GR005  require_payload_parse       API 호출 근처 payload .parse() 누락           [validation]
# GR006  no_bff_deprecated           api.bff.client/server 사용                    [architecture]
# GR007  no_dto_reexport             types/index.ts DTO 직접 re-export             [architecture]
# GR008  domain_dependency_violation domain.ts에서 infrastructure import (info)    [architecture]
# GR009  typescript_error            TypeScript 타입 오류                          [typescript]
# GR010  eslint_error                ESLint 규칙 위반                              [eslint]

# ── 카운터 ────────────────────────────────────────────────────────────────────
ERRORS=0          # 검사 단위 실패 수 (콘솔 요약 + exit code 기준)
DIAG_ERRORS=0     # individual error diagnostics   (JSON summary 기준)
DIAG_WARNINGS=0   # individual warning diagnostics
DIAG_INFOS=0      # individual info diagnostics

# ── Diagnostics 초기화 ────────────────────────────────────────────────────────
DIAG_DIR=".ai/tmp"
DIAG_FILE="$DIAG_DIR/diagnostics.json"
DIAG_TMP="$DIAG_DIR/.diagnostics_entries.tmp"
DIAG_COUNT=0

mkdir -p "$DIAG_DIR"
: > "$DIAG_TMP"

# ── write_diagnostics: JSON envelope 생성 ─────────────────────────────────────
write_diagnostics() {
  local status="passed"
  [ "$DIAG_ERRORS" -gt 0 ] && status="failed"

  {
    printf '{\n'
    printf '  "schemaVersion": "1.0",\n'
    printf '  "status": "%s",\n' "$status"
    printf '  "summary": {\n'
    printf '    "errors": %d,\n'   "$DIAG_ERRORS"
    printf '    "warnings": %d,\n' "$DIAG_WARNINGS"
    printf '    "infos": %d\n'     "$DIAG_INFOS"
    printf '  },\n'
    printf '  "diagnostics": [\n'
    if [ -s "$DIAG_TMP" ]; then
      cat "$DIAG_TMP"
      printf '\n'
    fi
    printf '  ]\n'
    printf '}\n'
  } > "$DIAG_FILE"

  rm -f "$DIAG_TMP"
}

# ── add_diagnostic ────────────────────────────────────────────────────────────
# 사용: add_diagnostic RULE_ID RULE_NAME SEVERITY FILE LINE MESSAGE [SUGGESTION] [DOCS]
# SEVERITY : error | warning | info
# LINE     : 정수 또는 "" → JSON null
# DOCS     : 공백 구분 doc 경로 목록 (선택)
add_diagnostic() {
  local rule_id="$1" rule_name="$2" severity="$3"
  local file="$4"    line="$5"    message="$6"
  local suggestion="${7:-}" docs_list="${8:-}"

  # Category lookup (rule_id → category)
  local category
  case "$rule_id" in
    GR001|GR006|GR007|GR008) category="architecture"   ;;
    GR002)                    category="react-query"    ;;
    GR003)                    category="mutation"       ;;
    GR004)                    category="error-handling" ;;
    GR005)                    category="validation"     ;;
    GR009)                    category="typescript"     ;;
    GR010)                    category="eslint"         ;;
    *)                        category="general"        ;;
  esac

  # Severity counters
  case "$severity" in
    error)   DIAG_ERRORS=$(( DIAG_ERRORS + 1 ))     ;;
    warning) DIAG_WARNINGS=$(( DIAG_WARNINGS + 1 )) ;;
    info)    DIAG_INFOS=$(( DIAG_INFOS + 1 ))       ;;
  esac

  # line → JSON number or null
  local line_json="null"
  [[ "$line" =~ ^[0-9]+$ ]] && line_json="$line"

  # docs array
  local docs_json='[]'
  if [ -n "$docs_list" ]; then
    local d first=true arr='['
    for d in $docs_list; do
      [ "$first" = true ] && first=false || arr="$arr, "
      arr="${arr}\"${d}\""
    done
    docs_json="${arr}]"
  fi

  # JSON-escape strings
  # TODO: JSON escaping complexity 증가 시 TypeScript runner 전환 고려
  local esc_file esc_msg esc_sug
  esc_file=$(printf '%s' "$file"       | sed 's/\\/\\\\/g; s/"/\\"/g')
  esc_msg=$(printf '%s'  "$message"    | sed 's/\\/\\\\/g; s/"/\\"/g')
  esc_sug=$(printf '%s'  "$suggestion" | sed 's/\\/\\\\/g; s/"/\\"/g')

  # Append JSON entry
  if [ "$DIAG_COUNT" -gt 0 ]; then
    printf ',\n' >> "$DIAG_TMP"
  fi
  printf '    {\n      "ruleId": "%s",\n      "ruleName": "%s",\n      "category": "%s",\n      "severity": "%s",\n      "file": "%s",\n      "line": %s,\n      "message": "%s",\n      "suggestion": "%s",\n      "docs": %s\n    }' \
    "$rule_id" "$rule_name" "$category" "$severity" \
    "$esc_file" "$line_json" \
    "$esc_msg" "$esc_sug" \
    "$docs_json" >> "$DIAG_TMP"
  DIAG_COUNT=$(( DIAG_COUNT + 1 ))

  # Console output
  local icon='❌'
  [ "$severity" = 'warning' ] && icon='⚠️ '
  [ "$severity" = 'info'    ] && icon='ℹ️ '
  echo "$icon [$rule_id] $message"
  if [ -n "$file" ]; then
    [ "$line_json" != "null" ] && echo "   $file:$line" || echo "   $file"
  fi
  [ -n "$suggestion" ] && echo "   → $suggestion"
}

echo "=== AI Guardrails Check ==="
echo "대상: 신규 생성 코드 기준 (기존 레거시 경로 제외)"
echo ""

# ── 레거시 경로 목록 (기존 위반이 이미 존재하는 경로 — 신규 작성 금지) ──────────
LEGACY_FEATURE_PATHS=(
  "src/features/auth"
  "src/features/study-notes/api"
  "src/features/dashboard/studynote"
  "src/features/dashboard/api"
  "src/features/list/api"
  "src/features/qna/services"
  "src/features/qna/components"
  "src/features/invite"
  "src/features/study-rooms/api"
  "src/features/study-rooms/components/sidebar/services"
  "src/features/study-rooms/model"
)

# ── Helper: 근접 줄 검사 ───────────────────────────────────────────────────────
# grep_near FILE PATTERN NEAR_PATTERN [WITHIN=5]
grep_near() {
  local file="$1" pattern="$2" near_pattern="$3" within="${4:-5}"
  while IFS= read -r match; do
    local lineno="${match%%:*}"
    local start=$(( lineno - within )); [ "$start" -lt 1 ] && start=1
    local end=$(( lineno + within ))
    if sed -n "${start},${end}p" "$file" 2>/dev/null | grep -q "$near_pattern"; then
      return 0
    fi
  done < <(grep -n "$pattern" "$file" 2>/dev/null)
  return 1
}

# ── 1. features 레이어 API 직접 사용 검사 [GR001] ─────────────────────────────
echo "1. features 레이어 API 직접 사용 검사 (레거시 경로 제외)..."
GR001_FOUND=0

while IFS= read -r f; do
  IS_LEGACY=false
  for legacy in "${LEGACY_FEATURE_PATHS[@]}"; do
    [[ "$f" == "$legacy"* ]] && IS_LEGACY=true && break
  done
  [ "$IS_LEGACY" = true ] && continue
  [[ "$f" == *"__tests__"* ]] && continue

  while IFS= read -r match; do
    [ -z "$match" ] && continue
    lineno="${match%%:*}"
    add_diagnostic "GR001" "no_api_private" "error" "$f" "$lineno" \
      "features에서 API 클라이언트 직접 사용" \
      "API 호출을 entities/{domain}/infrastructure/{domain}.repository.ts 로 이동하세요" \
      "docs/architecture.md"
    GR001_FOUND=$(( GR001_FOUND + 1 ))
  done < <(grep -n "api\.private\|api\.public" "$f" 2>/dev/null || true)
done < <(find src/features \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null)

if [ "$GR001_FOUND" -gt 0 ]; then
  ERRORS=$(( ERRORS + 1 ))
else
  echo "   ✅ 통과"
fi

echo ""

# ── 2. 폐기된 BFF 클라이언트 사용 검사 [GR006] ───────────────────────────────
# 제외: src/app/api/ (Next.js BFF 라우트 — api.bff.server 사용이 정상)
# 제외: 레거시 features/auth, features/dashboard, entities/member
echo "2. 폐기된 api.bff 클라이언트 사용 검사 (BFF 라우트·레거시 제외)..."

BFF_LEGACY=(
  "src/app/api"
  "src/features/auth"
  "src/features/dashboard/api"
  "src/entities/member"
)
GR006_FOUND=0

while IFS= read -r f; do
  IS_EXCLUDED=false
  for ex in "${BFF_LEGACY[@]}"; do
    [[ "$f" == "$ex"* ]] && IS_EXCLUDED=true && break
  done
  [ "$IS_EXCLUDED" = true ] && continue

  while IFS= read -r match; do
    [ -z "$match" ] && continue
    lineno="${match%%:*}"
    add_diagnostic "GR006" "no_bff_deprecated" "error" "$f" "$lineno" \
      "폐기된 api.bff 클라이언트 사용" \
      "api.private (인증 필요) 또는 api.public (인증 불필요) 을 사용하세요" \
      "docs/architecture.md"
    GR006_FOUND=$(( GR006_FOUND + 1 ))
  done < <(grep -n "api\.bff\.client\|api\.bff\.server" "$f" 2>/dev/null || true)
done < <(find src \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null)

if [ "$GR006_FOUND" -gt 0 ]; then
  ERRORS=$(( ERRORS + 1 ))
else
  echo "   ✅ 통과"
fi

echo ""

# ── 3. queryKey 배열 리터럴 하드코딩 검사 [GR002] ────────────────────────────
echo "3. queryKey 하드코딩 검사 (레거시 경로 제외)..."

QUERYKEY_LEGACY=(
  "src/features/qna"
  "src/features/invite"
)
GR002_FOUND=0

while IFS= read -r f; do
  [[ "$f" == *.keys.ts ]] && continue
  [[ "$f" == *"__tests__"* ]] && continue

  IS_LEGACY=false
  for legacy in "${QUERYKEY_LEGACY[@]}"; do
    [[ "$f" == "$legacy"* ]] && IS_LEGACY=true && break
  done
  [ "$IS_LEGACY" = true ] && continue

  while IFS= read -r match; do
    [ -z "$match" ] && continue
    lineno="${match%%:*}"
    add_diagnostic "GR002" "no_query_key_hardcode" "error" "$f" "$lineno" \
      "queryKey 배열 리터럴 하드코딩 감지" \
      "{domain}Keys.list() 등 키 팩토리를 사용하세요" \
      "docs/entities.md"
    GR002_FOUND=$(( GR002_FOUND + 1 ))
  done < <(grep -n "queryKey: \['" "$f" 2>/dev/null | grep -v "Keys\.\|keys\." || true)
done < <(find src \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null)

if [ "$GR002_FOUND" -gt 0 ]; then
  ERRORS=$(( ERRORS + 1 ))
else
  echo "   ✅ 통과"
fi

echo ""

# ── 4. types/index.ts DTO 스키마 직접 re-export 검사 [GR007] ─────────────────
echo "4. types/index.ts DTO 스키마 직접 re-export 검사..."
GR007_FOUND=0

while IFS= read -r match; do
  [ -z "$match" ] && continue
  # grep -rn 출력 형식: "path/to/file.ts:14: content"
  local_file="${match%%:*}"
  rest="${match#*:}"
  lineno="${rest%%:*}"
  add_diagnostic "GR007" "no_dto_reexport" "error" "$local_file" "$lineno" \
    "types/index.ts에서 infrastructure 스키마 직접 re-export" \
    "z.infer<typeof dto.xxx> 형태로 변환된 타입만 export하세요" \
    "docs/entities.md"
  GR007_FOUND=$(( GR007_FOUND + 1 ))
done < <(grep -rn "from.*infrastructure\|from.*\.dto" \
  src/entities/*/types/index.ts 2>/dev/null | grep "^.*export" || true)

if [ "$GR007_FOUND" -gt 0 ]; then
  ERRORS=$(( ERRORS + 1 ))
else
  echo "   ✅ 통과"
fi

echo ""

# ── 5. domain.ts 의존 방향 검사 [GR008] (INFO) ────────────────────────────────
echo "5. domain.ts 의존 방향 검사 (신규 도메인만, INFO)..."
NEW_DOMAINS=()
GR008_FOUND=0

if [ ${#NEW_DOMAINS[@]} -gt 0 ]; then
  for domain in "${NEW_DOMAINS[@]}"; do
    while IFS= read -r match; do
      [ -z "$match" ] && continue
      local_file="${match%%:*}"
      rest="${match#*:}"
      lineno="${rest%%:*}"
      add_diagnostic "GR008" "domain_dependency_violation" "info" "$local_file" "$lineno" \
        "domain.ts에서 infrastructure import 감지" \
        "domain.ts는 순수 Zod 스키마만 정의하세요. 변환 로직은 repository.ts에 작성하세요"
      GR008_FOUND=$(( GR008_FOUND + 1 ))
    done < <(grep -rn "from.*infrastructure\|from.*\.dto\|from.*\.repository" \
      "src/entities/$domain/core/" --include="*.ts" 2>/dev/null || true)
  done
fi

if [ "$GR008_FOUND" -eq 0 ]; then
  echo "   ✅ 통과 (신규 도메인 없음)"
fi

echo ""

# ── 6. TypeScript 타입 검사 [GR009] ──────────────────────────────────────────
echo "6. TypeScript 타입 검사..."
if npm run check-types 2>&1; then
  echo "   ✅ 통과"
else
  add_diagnostic "GR009" "typescript_error" "error" "" "" \
    "TypeScript 타입 오류 감지" \
    "npm run check-types 출력을 확인하고 타입 오류를 수정하세요"
  ERRORS=$(( ERRORS + 1 ))
fi

echo ""

# ── 7. ESLint 검사 [GR010] ────────────────────────────────────────────────────
echo "7. ESLint 검사..."
if npm run lint 2>&1; then
  echo "   ✅ 통과"
else
  add_diagnostic "GR010" "eslint_error" "error" "" "" \
    "ESLint 규칙 위반 감지" \
    "npm run lint 출력을 확인하고 규칙 위반을 수정하세요"
  ERRORS=$(( ERRORS + 1 ))
fi

echo ""

# ── git 기반 신규/수정 파일 목록 ──────────────────────────────────────────────
# CI: PR 브랜치 vs 베이스 브랜치 비교 / 로컬: 미커밋 변경 + untracked 파일
GIT_CHANGED_FILES=()
if [ -n "$CI" ]; then
  BASE="${GITHUB_BASE_REF:-develop}"
  git fetch origin "$BASE" --depth=1 2>/dev/null || true
  while IFS= read -r f; do
    [ -f "$f" ] && GIT_CHANGED_FILES+=("$f")
  done < <(git diff --name-only "origin/$BASE"...HEAD 2>/dev/null | sort -u)
else
  while IFS= read -r f; do
    [ -f "$f" ] && GIT_CHANGED_FILES+=("$f")
  done < <({
    git diff --name-only HEAD 2>/dev/null
    git ls-files --others --exclude-standard 2>/dev/null
  } | sort -u)
fi

# ── 8. mutation invalidateQueries 누락 검사 [GR003] ──────────────────────────
echo "8. mutation hook invalidateQueries 누락 검사 (신규/수정 파일 기준)..."

MUTATION_FILES=()
for f in "${GIT_CHANGED_FILES[@]}"; do
  [[ "$f" =~ src/features/.*use-(create|update|delete)-.*\.ts$ ]] && MUTATION_FILES+=("$f")
done

if [ ${#MUTATION_FILES[@]} -eq 0 ]; then
  echo "   ✅ 통과 (신규 mutation hook 없음)"
else
  GR003_FOUND=0
  for f in "${MUTATION_FILES[@]}"; do
    if ! grep_near "$f" "onSuccess" "invalidateQueries" 10; then
      add_diagnostic "GR003" "require_invalidate_queries" "error" "$f" "" \
        "mutation onSuccess에 invalidateQueries 누락" \
        "onSuccess에서 관련 queryKey를 invalidate하세요" \
        ".ai/skills/create-post-mutation.md"
      GR003_FOUND=$(( GR003_FOUND + 1 ))
    fi
  done
  if [ "$GR003_FOUND" -gt 0 ]; then
    ERRORS=$(( ERRORS + 1 ))
  else
    echo "   ✅ 통과"
  fi
fi

echo ""

# ── 9. mutation handleApiError 누락 검사 [GR004] (WARNING) ───────────────────
echo "9. mutation hook handleApiError 누락 검사 (신규/수정 파일 기준, WARNING)..."

if [ ${#MUTATION_FILES[@]} -eq 0 ]; then
  echo "   ✅ 통과 (신규 mutation hook 없음)"
else
  GR004_FOUND=0
  for f in "${MUTATION_FILES[@]}"; do
    if ! grep -q "handleApiError" "$f" 2>/dev/null; then
      add_diagnostic "GR004" "require_handle_api_error" "warning" "$f" "" \
        "handleApiError 미사용" \
        "폼 없는 액션: 훅 내부 onError에 추가. 폼 있는 mutation: 컴포넌트 mutate() onError에서 처리" \
        ".ai/skills/create-post-mutation.md"
      GR004_FOUND=$(( GR004_FOUND + 1 ))
    fi
  done
  if [ "$GR004_FOUND" -eq 0 ]; then
    echo "   ✅ 통과"
  fi
fi

echo ""

# ── 10. repository payload .parse() 누락 검사 [GR005] ────────────────────────
echo "10. repository payload .parse() 누락 검사 (신규/수정 파일 기준)..."
GR005_FOUND=0

for f in "${GIT_CHANGED_FILES[@]}"; do
  [[ "$f" =~ src/entities/.*/infrastructure/.*\.repository\.ts$ ]] || continue
  if grep -q "api\.\(private\|public\)\.\(post\|put\|patch\)" "$f" 2>/dev/null; then
    if ! grep_near "$f" "api\.\(private\|public\)\.\(post\|put\|patch\)" "\.parse(" 5; then
      add_diagnostic "GR005" "require_payload_parse" "error" "$f" "" \
        "API 호출 근처에 payload .parse() 누락" \
        "api.private.post/put/patch 호출 5줄 내에 payload.xxx.parse() 를 추가하세요" \
        ".ai/skills/create-post-mutation.md"
      GR005_FOUND=$(( GR005_FOUND + 1 ))
    fi
  fi
done

if [ "$GR005_FOUND" -gt 0 ]; then
  ERRORS=$(( ERRORS + 1 ))
else
  echo "   ✅ 통과 (신규 repository 없음 또는 모두 통과)"
fi

echo ""

# ── diagnostics.json 생성 ─────────────────────────────────────────────────────
write_diagnostics

echo "📄 diagnostics → $DIAG_FILE"
echo "   errors: $DIAG_ERRORS  warnings: $DIAG_WARNINGS  infos: $DIAG_INFOS"
echo ""

# ── 결과 출력 ─────────────────────────────────────────────────────────────────
echo "─────────────────────────────────────"
if [ "$ERRORS" -eq 0 ]; then
  echo "✅ 모든 guardrail 검사 통과"
else
  echo "❌ 총 ${ERRORS}개 검사 실패"
  echo "   위 항목을 수정한 후 다시 실행하세요."
  echo "   참조: .ai/hooks/guardrails.yaml"
  exit 1
fi
