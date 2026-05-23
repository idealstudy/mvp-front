#!/bin/bash
# AI Guardrails Check
# 사용법: bash .ai/hooks/ai-check.sh
#
# 목적: AI agent가 생성한 신규 코드의 레이어 위반을 감지한다.
# 범위: 신규 코드 기준. 기존 레거시 코드(features/auth, features/study-notes 등)는
#       AGENTS.md "Do not refactor existing code" 원칙에 따라 검사 제외.

set -e
ERRORS=0

echo "=== AI Guardrails Check ==="
echo "대상: 신규 생성 코드 기준 (기존 레거시 경로 제외)"
echo ""

# ── 레거시 경로 목록 (기존 위반이 이미 존재하는 경로 — 신규 작성 금지) ──────────
# 이 경로들은 리팩토링 금지 원칙에 따라 현재 검사에서 제외한다.
# 신규 파일은 이 경로에 추가하지 않는다.
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
# PATTERN 매치 라인 기준 ±WITHIN 줄 내에 NEAR_PATTERN이 있으면 0 반환
grep_near() {
  local file="$1" pattern="$2" near_pattern="$3" within="${4:-5}"
  while IFS= read -r match; do
    local lineno="${match%%:*}"
    local start=$((lineno - within)); [ $start -lt 1 ] && start=1
    local end=$((lineno + within))
    if sed -n "${start},${end}p" "$file" 2>/dev/null | grep -q "$near_pattern"; then
      return 0
    fi
  done < <(grep -n "$pattern" "$file" 2>/dev/null)
  return 1
}

# ── 1. 신규 features 코드에서 API 클라이언트 직접 사용 검사 ─────────────────────
echo "1. features 레이어 API 직접 사용 검사 (레거시 경로 제외)..."

FOUND=""
while IFS= read -r f; do
  IS_LEGACY=false
  for legacy in "${LEGACY_FEATURE_PATHS[@]}"; do
    if [[ "$f" == $legacy* ]]; then
      IS_LEGACY=true
      break
    fi
  done
  [ "$IS_LEGACY" = true ] && continue
  [[ "$f" == *"__tests__"* ]] && continue

  MATCH=$(grep -n "api\.private\|api\.public" "$f" 2>/dev/null || true)
  if [ -n "$MATCH" ]; then
    FOUND="$FOUND\n$f:\n$MATCH"
  fi
done < <(find src/features \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null)

if [ -n "$FOUND" ]; then
  echo "❌ [LAYER VIOLATION] features에서 API 클라이언트 직접 사용 감지:"
  echo -e "$FOUND"
  echo "   → API 호출을 entities/{domain}/infrastructure/{domain}.repository.ts 로 이동하세요"
  echo "   → 참조: docs/architecture.md Rule 1"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ 통과"
fi

echo ""

# ── 2. 폐기된 BFF 클라이언트 사용 검사 ────────────────────────────────────────
# 제외: src/app/api/ (Next.js BFF 라우트 — api.bff.server 사용이 정상)
# 제외: 레거시 features/auth, features/dashboard, entities/member (기존 코드)
echo "2. 폐기된 api.bff 클라이언트 사용 검사 (BFF 라우트·레거시 제외)..."

BFF_LEGACY=(
  "src/app/api"
  "src/features/auth"
  "src/features/dashboard/api"
  "src/entities/member"
)

BFF_FOUND=""
while IFS= read -r f; do
  IS_EXCLUDED=false
  for ex in "${BFF_LEGACY[@]}"; do
    if [[ "$f" == $ex* ]]; then
      IS_EXCLUDED=true
      break
    fi
  done
  [ "$IS_EXCLUDED" = true ] && continue

  MATCH=$(grep -n "api\.bff\.client\|api\.bff\.server" "$f" 2>/dev/null || true)
  if [ -n "$MATCH" ]; then
    BFF_FOUND="$BFF_FOUND\n$f:\n$MATCH"
  fi
done < <(find src \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null)

if [ -n "$BFF_FOUND" ]; then
  echo "❌ [DEPRECATED] api.bff.client / api.bff.server 사용 감지:"
  echo -e "$BFF_FOUND"
  echo "   → api.private (인증 필요) 또는 api.public (인증 불필요) 을 사용하세요"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ 통과"
fi

echo ""

# ── 3. queryKey 배열 리터럴 하드코딩 검사 ─────────────────────────────────────
echo "3. queryKey 하드코딩 검사 (레거시 경로 제외)..."

QUERYKEY_LEGACY=(
  "src/features/qna"
  "src/features/invite"
)

QUERYKEY_FOUND=""
while IFS= read -r f; do
  # .keys.ts 파일 자체 제외
  [[ "$f" == *.keys.ts ]] && continue
  [[ "$f" == *"__tests__"* ]] && continue

  IS_LEGACY=false
  for legacy in "${QUERYKEY_LEGACY[@]}"; do
    if [[ "$f" == $legacy* ]]; then
      IS_LEGACY=true
      break
    fi
  done
  [ "$IS_LEGACY" = true ] && continue

  MATCH=$(grep -n "queryKey: \['" "$f" 2>/dev/null | grep -v "Keys\.\|keys\." || true)
  if [ -n "$MATCH" ]; then
    QUERYKEY_FOUND="$QUERYKEY_FOUND\n$f:\n$MATCH"
  fi
done < <(find src -name "*.ts" -o -name "*.tsx" 2>/dev/null)

if [ -n "$QUERYKEY_FOUND" ]; then
  echo "❌ [RULE VIOLATION] queryKey 배열 리터럴 하드코딩 감지:"
  echo -e "$QUERYKEY_FOUND"
  echo "   → {domain}Keys.list() 등 키 팩토리를 사용하세요"
  echo "   → 참조: docs/entities.md — TanStack Query Keys"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ 통과"
fi

echo ""

# ── 4. types/index.ts에서 DTO 스키마 직접 re-export 검사 ──────────────────────
# 검사 대상: z.infer<> 없이 infrastructure 파일에서 스키마를 그대로 re-export하는 경우
# 허용: export type Xxx = z.infer<typeof dto.xxx>  (이름에 DTO 포함해도 무관)
# 금지: export { XxxDtoSchema } from '../infrastructure/...'
#        export type { XxxDtoSchema } from '../infrastructure/...'
echo "4. types/index.ts DTO 스키마 직접 re-export 검사..."
FOUND=$(grep -rn "from.*infrastructure\|from.*\.dto" \
  src/entities/*/types/index.ts 2>/dev/null | \
  grep "^.*export" || true)

if [ -n "$FOUND" ]; then
  echo "❌ [LAYER VIOLATION] types/index.ts에서 infrastructure 스키마 직접 re-export 감지:"
  echo "$FOUND"
  echo "   → z.infer<typeof dto.xxx> 형태로 변환된 타입만 export하세요"
  echo "   → 타입 이름에 DTO suffix를 사용하는 것은 허용됩니다"
  echo "   → 참조: docs/entities.md Rule 1"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ 통과"
fi

echo ""

# ── 5. 신규 domain.ts 의존 방향 검사 (INFO 레벨) ──────────────────────────────
# 기존 코드는 이 패턴을 사용하므로 ERROR가 아닌 INFO로만 출력한다.
# 신규 도메인 작성 시 domain.ts에서 infrastructure를 import하지 않는 것을 권장한다.
echo "5. domain.ts 의존 방향 검사 (신규 도메인만, INFO)..."

NEW_DOMAINS=()  # 신규 도메인이 있으면 여기에 추가
DOMAIN_VIOLATIONS=""

if [ ${#NEW_DOMAINS[@]} -gt 0 ]; then
  for domain in "${NEW_DOMAINS[@]}"; do
    MATCH=$(grep -rn "from.*infrastructure\|from.*\.dto\|from.*\.repository" \
      "src/entities/$domain/core/" --include="*.ts" 2>/dev/null || true)
    if [ -n "$MATCH" ]; then
      DOMAIN_VIOLATIONS="$DOMAIN_VIOLATIONS\n$MATCH"
    fi
  done
fi

if [ -n "$DOMAIN_VIOLATIONS" ]; then
  echo "   ℹ️  [INFO] 신규 domain.ts에서 infrastructure import 감지:"
  echo -e "$DOMAIN_VIOLATIONS"
  echo "   → domain.ts는 순수 Zod 스키마만 정의하는 것을 권장합니다"
  echo "   → 변환 로직은 repository.ts에 작성하세요"
  echo "   → (기존 도메인의 동일 패턴은 레거시로 허용됩니다)"
else
  echo "   ✅ 통과 (신규 도메인 없음)"
fi

echo ""

# ── 6. TypeScript 타입 검사 ──────────────────────────────────────────────────
echo "6. TypeScript 타입 검사..."
if npm run check-types 2>&1; then
  echo "   ✅ 통과"
else
  ERRORS=$((ERRORS + 1))
fi

echo ""

# ── 7. ESLint 검사 ─────────────────────────────────────────────────────────
echo "7. ESLint 검사..."
if npm run lint 2>&1; then
  echo "   ✅ 통과"
else
  ERRORS=$((ERRORS + 1))
fi

echo ""

# ── git 기반 신규/수정 파일 목록 ──────────────────────────────────────────────
# CI($CI 환경 변수가 설정된 경우): PR 브랜치 vs 베이스 브랜치 비교
# 로컬: 커밋되지 않은 변경 파일 + 신규 untracked 파일
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

# ── 8. mutation hook invalidateQueries 누락 검사 ──────────────────────────────
echo "8. mutation hook invalidateQueries 누락 검사 (신규/수정 파일 기준)..."

MUTATION_FILES=()
for f in "${GIT_CHANGED_FILES[@]}"; do
  [[ "$f" =~ src/features/.*use-(create|update|delete)-.*\.ts$ ]] && MUTATION_FILES+=("$f")
done

if [ ${#MUTATION_FILES[@]} -eq 0 ]; then
  echo "   ✅ 통과 (신규 mutation hook 없음)"
else
  INVALIDATE_MISSING=""
  for f in "${MUTATION_FILES[@]}"; do
    if ! grep_near "$f" "onSuccess" "invalidateQueries" 10; then
      INVALIDATE_MISSING="$INVALIDATE_MISSING\n  $f"
    fi
  done

  if [ -n "$INVALIDATE_MISSING" ]; then
    echo "❌ [MISSING] onSuccess 내 invalidateQueries 누락:"
    echo -e "$INVALIDATE_MISSING"
    echo "   → onSuccess에서 관련 queryKey를 invalidate하세요"
    echo "   → 참조: .ai/skills/create-post-mutation.md"
    ERRORS=$((ERRORS + 1))
  else
    echo "   ✅ 통과"
  fi
fi

echo ""

# ── 9. mutation hook handleApiError 누락 검사 (WARNING) ───────────────────────
echo "9. mutation hook handleApiError 누락 검사 (신규/수정 파일 기준, WARNING)..."

if [ ${#MUTATION_FILES[@]} -eq 0 ]; then
  echo "   ✅ 통과 (신규 mutation hook 없음)"
else
  HANDLEAPI_MISSING=""
  for f in "${MUTATION_FILES[@]}"; do
    if ! grep -q "handleApiError" "$f" 2>/dev/null; then
      HANDLEAPI_MISSING="$HANDLEAPI_MISSING\n  $f"
    fi
  done

  if [ -n "$HANDLEAPI_MISSING" ]; then
    echo "   ⚠️  [WARNING] handleApiError 미사용 파일:"
    echo -e "$HANDLEAPI_MISSING"
    echo "   → 폼 없는 액션: 훅 내부 onError에 handleApiError 추가"
    echo "   → 폼 있는 mutation: 컴포넌트의 mutate(data, { onError })에서 처리 (정상)"
    echo "   → 참조: .ai/skills/create-post-mutation.md — onError 처리 위치 선택"
  else
    echo "   ✅ 통과"
  fi
fi

echo ""

# ── 10. repository payload .parse() 누락 검사 ─────────────────────────────────
echo "10. repository payload .parse() 누락 검사 (신규/수정 파일 기준)..."

PARSE_MISSING=""
for f in "${GIT_CHANGED_FILES[@]}"; do
  [[ "$f" =~ src/entities/.*/infrastructure/.*\.repository\.ts$ ]] || continue
  if grep -q "api\.\(private\|public\)\.\(post\|put\|patch\)" "$f" 2>/dev/null; then
    if ! grep_near "$f" "api\.\(private\|public\)\.\(post\|put\|patch\)" "\.parse(" 5; then
      PARSE_MISSING="$PARSE_MISSING\n  $f"
    fi
  fi
done

if [ -n "$PARSE_MISSING" ]; then
  echo "❌ [MISSING] API 호출 근처에 payload .parse() 누락:"
  echo -e "$PARSE_MISSING"
  echo "   → api.private.post/put/patch 호출 5줄 내에 payload.xxx.parse() 를 추가하세요"
  echo "   → 참조: .ai/skills/create-post-mutation.md"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ 통과 (신규 repository 없음 또는 모두 통과)"
fi

echo ""

# ── 결과 출력 ─────────────────────────────────────────────────────────────────
echo "─────────────────────────────────────"
if [ $ERRORS -eq 0 ]; then
  echo "✅ 모든 guardrail 검사 통과"
else
  echo "❌ 총 ${ERRORS}개 위반 감지"
  echo "   위 항목을 수정한 후 다시 실행하세요."
  echo "   참조: .ai/hooks/guardrails.yaml"
  exit 1
fi
