# drawing-panel.md — 드로잉 패널 작업 참조

> 드로잉 패널 작업 전에 먼저 읽는다. 전체 코드 재탐색 없이 현재 구조·제약을 파악하는 용도.

## 진입점

| UI | 용도 | 사용처 |
|---|---|---|
| **`DrawingPanel`** | 인라인 임베드 패널 (★주 작업 대상·현재 유일한 진입점) | `/test-drawing` |
| ~~`PdfDrawingFullscreen`~~ | 풀스크린 PDF+필기 | **삭제됨** — 재구현은 아래 "(삭제됨) PDF 풀스크린 패널" 참조 |

공용 코어(`DrawingCanvas` / `useDrawingCanvas` / `useStrokes` / `drawing-storage`)는 유지된다.

## 파일 위치

```
src/shared/components/drawing/
  ui/drawing-panel.tsx          ★ 패널 UI·로드/저장·툴바 (~590줄)
  ui/drawing-panel-icons.tsx    패널 아이콘·PanelToolBtn·SaveStatusIndicator (프레젠테이션)
  ui/drawing-minimap-strokes.tsx 미니맵 내부 획 폴리라인 렌더
  model/use-pan-zoom.ts         두 손가락 pan/zoom·확장 홀드·미니맵 제스처 훅 (~710줄)
  ui/drawing-canvas.tsx         <canvas> 얇은 래퍼
  model/use-drawing-canvas.ts   포인터 입력·perfect-freehand 렌더·renderStrokes()
  model/use-strokes.ts          획 상태 + undo/redo (useReducer)
  model/drawing-storage.ts      IndexedDB(idb) 저장/로드
  lib/                          stroke-input, densify/ensure-stroke-points, get-stroke-render-options, pointer-session-capture
  types/index.ts                Point, Stroke, DrawingTool, PageSize
src/providers/pen-select-guard.tsx   iPad Pencil 텍스트선택 방지 (전역)
src/app/test-drawing/page.tsx        패널 테스트 페이지
```

> 아래 파일/모듈은 PDF 풀스크린 패널과 함께 **삭제됨**: `ui/drawing-toolbar.tsx`,
> `ui/pdf-drawing-fullscreen.tsx`, `ui/pdf-drawing-overlay.tsx`, `ui/pdf-panel.tsx`,
> `ui/pdf-viewer.tsx`, `ui/pdf-viewer.client.tsx`, `utils/export-pdf.ts`,
> `editor/ui/drawing-node.tsx`, `editor/model/drawing-extension.ts`.

## 데이터 모델

```ts
Point  = { x, y, pressure? }              // 정규화 좌표 0~1
Stroke = { id, pageNumber, points, color, size, tool, layoutHeight? }
DrawingTool = 'pen' | 'highlighter' | 'eraser'
```
- 좌표는 **정규화(0~1)** 저장. 렌더 시 `y * layoutHeight`.
- `layoutHeight`: 캔버스 확장 시 기존 획의 픽셀 위치를 고정하기 위한 획별 기준 높이.
- 저장소: IndexedDB `drawing-db`/`strokes`. 키 `{documentId}:{page}` = strokes, `{documentId}:canvas-meta` = 높이(패널 전용).

## DrawingPanel 기능 (현재)

- Props: `documentId`(필수), `panelHeight`(400), `initialCanvasHeight`, `expandRatio`(0.3), `actionButton`, `capturePointerSession`(dev 전용).
- **도구**: 펜 · 형광펜 · 지우개. 색 팔레트는 도구별로 다름(`PANEL_COLORS` / `HIGHLIGHTER_COLORS` 파스텔). 굵기 `PEN_SIZES = [2,4,7]` 3단계(펜·형광펜 공통).
  - 도구 전환 시 각 도구가 **마지막으로 쓰던 색을 복원**(`penColorRef`/`highlighterColorRef`). 지우개는 색 변경 없음.
  - 굵기 점 미리보기: 미선택 회색, 선택 시 도구 활성 주황(`orange-7`). 선택 표시는 버튼 테두리(`border-orange-7`).
- **툴바 레이아웃**: `flex-wrap` — 폭 부족 시 아랫줄로 내려감. 도구 버튼은 `h-12` 고정(툴 선택과 무관하게 높이 일정). 버튼 텍스트는 `whitespace-nowrap`.
- **캔버스 확장**: 두 손가락으로 맨 아래 도달 → 1초 유지 → 높이 +`expandRatio`. 확장 시 기존 획에 `layoutHeight` 동결. 획이 모두 지워지면 높이를 컴포넌트 크기로 리셋.
- **자동저장**: 700ms debounce → `savePageStrokes(documentId, 1, ...)`. 실패 시 성공할 때까지 `SAVE_RETRY_DELAY_MS`(2s) 간격 반복 재시도. `saveCanvasHeight`는 확장/리셋 시 호출.
- **저장 상태 표시**(`SaveStatusIndicator`): 캔버스 **좌하단 absolute 오버레이**(알약형). `saving`/`saved`/`error`. `'저장됨'`은 `SAVED_VISIBLE_MS`(1.5s) 후 자동으로 `idle`로 숨김. 위치는 `style={{ left, bottom }}` 인라인(클래스 캐시 이슈 회피, 아래 참고).
- `data-drawing-surface` 속성으로 `PenSelectGuard`가 필기 영역을 인식.

## 제스처 (use-pan-zoom.ts) — 핵심 불변식

- **입력 분기**: 두 손가락 = pan/zoom/확장, 한 손가락 = 무시(안내 토스트), stylus = 필기(`countFingerTouches`가 stylus 제외).
- **의도 잠금**: 제스처 시작 `gestureMode='idle'`. **pan 우선** — 중심 이동 ≥`GESTURE_PAN_LOCK_PX`(8)이고 간격 변화 이상이면 `pan`, 아니고 간격 변화 ≥`GESTURE_ZOOM_LOCK_PX`(16)면 `zoom`으로 제스처 끝까지 잠금. 한 제스처 안에서 pan↔zoom 동시 불가(의도된 분리).
- **줌**: `clampZoom`로 `MIN_ZOOM`(1)~`MAX_ZOOM`(4). 1 근처는 `ZOOM_SNAP_THRESHOLD`로 정확히 1로 스냅(→ `overflow-x` off, `maxLeft=0`이라 원래 크기에서 좌우 이동 불가). 떨림 방지 `PINCH_ZOOM_DEADZONE`/`PAN_JITTER_DEADZONE_PX`, 단 경계(1/4)에선 데드존 무시하고 스냅.
- **pan 한계**: 순수함수 `maxPanY(canvasH, zoom, expandSlotPx, clientH)` 단일 소스. 휠·클램프는 `expandSlotPx=0`(슬롯 미진입), 터치 제스처는 `expandSlotPx()`(슬롯에 닿아 확장 홀드 가능).
- **줌 시각 갱신**: `applyZoomVisual`가 핀치 중 리렌더 없이 DOM만 갱신(wrapper 크기·scale·`overflow-x` 토글·줌% 배지 textContent). 줌 % 배지는 좌상단, `zoom>1`일 때만 노출.
- **mount-once effect**: 제스처 리스너 effect의 deps는 `[applyZoomVisual, abortDrawingRef]`뿐. 변하는 값(canvasW/H·hasExpandSlot·panelHeight·onExpand)은 전부 ref로 읽는다 → 캔버스 크기/획 변화에도 재구독 안 함.

## 미니맵

- 확장 또는 확대로 화면 밖 영역이 생기면 우상단에 표시. 캔버스 비율 박스 + 현재 뷰포트 사각형(주황) + 획 폴리라인(`MinimapStrokes`).
- 뷰포트 사각형 세로는 **캔버스 영역 `[0, contentH]`로 클램프** — 하단 확장 슬롯은 제외하고 보이는 캔버스 구간만 표시(슬롯까지 내려가도 캔버스 아래로 안 넘침).

## 공용 코어

- `useDrawingCanvas`: pen/mouse만 필기, perfect-freehand→Path2D, committed layer 캐시+live stroke, 지우개 반경 12px, iPad Scribble 우회(`abortDrawingRef`). `renderStrokes()`는 썸네일/PDF export 공용. 형광펜은 `globalAlpha 0.4`, size×3·thinning 0(`get-stroke-render-options`).
- `useStrokes`: add/erase/undo/redo/clear/set/mapAll (useReducer + undo/redo 스택).

## 스타일(Tailwind v4) — 주의

- 이 프로젝트는 `@theme`(globals.css)에 **커스텀 팔레트**를 정의한다: `gray-1`~`gray-12`(1=밝음, 12=어두움), `orange-1`~`orange-12`(`orange-7`=#ff4805 primary), 시맨틱 토큰(`text-main`, `line-line1` 등). 신규 코드는 이 커스텀 스케일을 쓴다(기본 `gray-400`/`orange-500` 등 혼용 금지).
- **하드 리프레시 주의**: dev에서 **새로 추가한 유틸 클래스**가 브라우저가 캐시한 옛 CSS에 없으면 적용 안 됨(예: `left:auto`로 0처럼 보임). 서버 재시작만으론 안 되고 **브라우저 하드 리프레시(⌘⇧R, Disable cache)** 필요. 인라인 `style`은 이 파이프라인을 안 거쳐 항상 즉시 반영됨.

## 의존성 / 테스트

- `perfect-freehand`(렌더), `idb`(저장). (PDF 패널이 쓰던 `pdf-lib`/`react-pdf`는 현재 미사용 — 아래 재구현 섹션 참고.)
- 저장은 **IndexedDB 로컬만**, 서버 API 없음(서버 연동 시 AGENTS.md: API는 `entities`에).
- 테스트: `/test-drawing?panels=0&capture=0`.

## 반복 금지 (과거 시행착오 요약)

- 제스처를 **매 프레임 pan+zoom 동시 계산**하던 구조로 회귀 금지 → 의도 잠금(pan 우선)이 현재 설계. 임계값만 조정(`GESTURE_*_LOCK_PX`).
- `clampZoom`의 **MIN 근처 스냅(`ZOOM_SNAP_THRESHOLD`) 제거 금지** → 제거 시 줌이 1.0x~1.04x에 끼여 "원래 크기인데 좌우 이동" 재발.
- 제스처 데드존 제거(무조건 재기록) 금지 → iPad 정지 시 떨림 재발.
- **커스텀 스크롤 thumb 복원 금지** → 미니맵으로 대체됨. (thumb 패딩 거터가 캔버스 폭을 늘려 가로 스크롤 유발했던 이슈도 있었음.)
- 제스처 effect에 primitive deps 추가 금지 → ref로 읽어 mount-once 유지(리스너 재구독 방지).
- `use-drawing-canvas.ts` 동일 스코프 `const canvas` 중복 선언 금지 → `/test-drawing` 500 (docs/drawing-internal-server-error.md).
- 자동저장에서 `getNextStrokes((prev)=>[...prev, stroke])`식 가공 금지 → 발화 시점 ref가 이미 최신이라 **마지막 획 중복 저장**됨. 항상 `strokesForSaveRef.current`를 그대로 저장.

## (삭제됨) PDF 위에 그리는 풀스크린 패널 — 재구현 참조

> 2026-05 삭제. 인라인 `DrawingPanel`과 별개로, **PDF(또는 빈 A4) 위에 필기**하고 페이지를 넘기며
> 필기 합성 PDF를 내보내는 풀스크린 UI였다. 공용 코어(`useStrokes`/`useDrawingCanvas`/`drawing-storage`/
> `renderStrokes`)는 그대로 재사용했고, 제스처 pan/zoom(`use-pan-zoom`)은 쓰지 않았다(자체 zoom 버튼 사용).

### 컴포넌트 구성 (재구현 시 만들 단위)

```
PdfDrawingFullscreen   풀스크린 컨테이너: 상태 오케스트레이션 + 페이지/줌 하단바 + 모달
  ├─ DrawingToolbar    상단 툴바(도구/색/굵기/undo/redo/전체지우기/저장(export)/닫기)
  ├─ PdfDrawingOverlay PDF 렌더 + 그 위에 DrawingCanvas 겹치기, fit-scale 계산
  │     ├─ PdfViewer        next/dynamic 래퍼(ssr:false) → PdfViewerClient
  │     │     └─ PdfViewerClient   react-pdf <Document>/<Page>, pdf.worker CDN, brightness/rotation/zoom
  │     └─ DrawingCanvas    공용 캔버스(pageSize에 맞춰 필기)
  └─ PdfPanel          우측 패널: PDF 업로드/제거, 페이지 썸네일, 줌/밝기/회전 슬라이더
```

### 핵심 동작/규약

- **상태**(`PdfDrawingFullscreen`): `tool/color/size`, `currentPage/totalPages`, `saveStatus`, `uploadedPdf(File)`, `zoom/brightness/rotation`, `isPdfPanelOpen`, 페이지초과 모달·전체지우기 모달.
- **페이지별 저장**: `useStrokes`는 현재 페이지 획만 보유. 페이지 전환 시 `loadPageStrokes(documentId, page)`로 교체, `allStrokesRef.current[page]`에 캐시(내보내기용 전체 보관). 저장 키는 `{documentId}:{page}`(인라인 패널은 page 항상 1).
- **자동저장**: 700ms debounce → `savePageStrokes(documentId, currentPage, ...)`. `'저장됨'`은 2s 후 idle. (인라인 패널의 무한 재시도 로직과는 별개였음.)
- **빈 캔버스 기본값**: PDF 없으면 A4 세로 `{794,1123}`로 그리기 시작, 최대 5페이지(`MAX_PAGES`). PDF 업로드 시 `numPages>5`면 초과 모달 후 앞 5p만 사용.
- **PdfDrawingOverlay**: `fillScreen`이면 외부 컨테이너를 `ResizeObserver`로 관찰해 `fit = min(availW/pageW, availH/pageH) * zoom` 스케일 계산. `transform: scale()`은 레이아웃 크기를 안 바꾸므로 래퍼를 스케일된 픽셀 크기로 고정하고 내부를 `transformOrigin:top-left`로 처리. PDF 페이지 렌더 성공 시 `onPageSizeChange`로 실제 px 크기를 받아 그 크기로 `DrawingCanvas`를 깔았다.
- **PdfViewerClient**: `react-pdf`(DOM 의존)라 **반드시 `ssr:false` dynamic import**로 SSR 번들에서 제외. `PDF_BASE_SCALE=1.5`. worker는 `//unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`. `brightness`는 컨테이너 CSS `filter`로.
- **내보내기**(`exportPdf(pdfUrl|null, allStrokes)`, `pdf-lib`): 원본 PDF가 있으면 로드, 없으면 A4(595×842) 페이지 생성. 페이지별로 화면과 **동일한 `renderStrokes()`**를 오프스크린 캔버스(`RENDER_SCALE=1.5`, react-pdf 배율과 일치)에 그려 PNG(투명배경)로 `embedPng` 후 페이지에 오버레이. blob 다운로드.
- **에디터 통합**(TipTap): `DrawingExtension`(`Node`, group `block`, `atom`, `draggable`, attrs `{pdfUrl, documentId}`, 커맨드 `setDrawing`)이 `DrawingNodeView`를 렌더. 노드뷰는 오프스크린(800×1123)에 `renderStrokes`로 page1 썸네일을 위에서 280px 크롭해 미리보기, 클릭 시 `PdfDrawingFullscreen` 오픈. ※ 이 익스텐션은 실제 에디터에 등록된 적 없고 스토리에서만 사용했다.

### 재구현 시 주의

- PDF 렌더 배율(`react-pdf` 1.5)과 내보내기 배율(`exportPdf` 1.5)을 **반드시 일치**시킬 것 → 굵기/위치가 화면과 PDF에서 동일해짐.
- `react-pdf`는 `'use client'` + `ssr:false` dynamic 경계를 지킬 것(SSR에서 깨짐). AnnotationLayer/TextLayer CSS import 필요.
- 새로 만들면 인라인 패널처럼 제스처 pan/zoom(`use-pan-zoom`)을 붙일지 결정 — 구버전은 버튼 줌만 있었음.
