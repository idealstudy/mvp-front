import type { Stroke } from '../types';
import type { StrokePoint } from './stroke-input';

/** 닫힌 루프(빠른 원 등) 판별 — 시작·끝 픽셀 거리 */
const CLOSED_LOOP_PX = 14;

/** 너무 가까운 샘플 제거 — 스플라인 미세 울퉁불퉁함 완화 */
const MIN_SAMPLE_PX = 1.5;

const CATMULL_ALPHA = 0.5;

type Px = { x: number; y: number };

function penLineWidth(strokeSize: number, pressure: number) {
  return Math.max(0.5, strokeSize * (0.35 + 0.65 * pressure));
}

function gapPx(
  a: StrokePoint,
  b: StrokePoint,
  canvasWidth: number,
  canvasHeight: number
) {
  return Math.hypot((b.x - a.x) * canvasWidth, (b.y - a.y) * canvasHeight);
}

function dedupeTrail(points: StrokePoint[]): StrokePoint[] {
  const out: StrokePoint[] = [];
  for (const p of points) {
    const last = out[out.length - 1];
    if (
      last &&
      last.x === p.x &&
      last.y === p.y &&
      (last.pressure ?? 0.5) === (p.pressure ?? 0.5)
    ) {
      continue;
    }
    out.push(p);
  }
  return out;
}

/** 인접 샘플이 MIN_SAMPLE_PX 미만이면 하나로 — 빠른 원의 점 밀집 떨림 방지 */
function simplifyTrail(
  trail: StrokePoint[],
  canvasWidth: number,
  canvasHeight: number
): StrokePoint[] {
  if (trail.length < 3) return trail;

  const out: StrokePoint[] = [trail[0]!];
  for (let i = 1; i < trail.length; i++) {
    const p = trail[i]!;
    const last = out[out.length - 1]!;
    if (gapPx(last, p, canvasWidth, canvasHeight) >= MIN_SAMPLE_PX) {
      out.push(p);
    }
  }

  const end = trail[trail.length - 1]!;
  const tail = out[out.length - 1]!;
  if (tail.x !== end.x || tail.y !== end.y) {
    out.push(end);
  }

  return out.length >= 2 ? out : trail;
}

function trailLengthPx(
  trail: StrokePoint[],
  canvasWidth: number,
  canvasHeight: number
) {
  let len = 0;
  for (let i = 1; i < trail.length; i++) {
    len += gapPx(trail[i - 1]!, trail[i]!, canvasWidth, canvasHeight);
  }
  return len;
}

function isClosedTrail(
  trail: StrokePoint[],
  canvasWidth: number,
  canvasHeight: number
) {
  if (trail.length < 4) return false;
  const closeGap = gapPx(
    trail[0]!,
    trail[trail.length - 1]!,
    canvasWidth,
    canvasHeight
  );
  if (closeGap > CLOSED_LOOP_PX) return false;
  return trailLengthPx(trail, canvasWidth, canvasHeight) > closeGap * 4;
}

/** 닫힌 루프: 겹치는 끝점 제거 후 주기 스플라인 */
function prepareTrail(
  trail: StrokePoint[],
  canvasWidth: number,
  canvasHeight: number
): { points: StrokePoint[]; closed: boolean } {
  let points = simplifyTrail(trail, canvasWidth, canvasHeight);
  const closed = isClosedTrail(points, canvasWidth, canvasHeight);

  if (closed && points.length >= 4) {
    const last = points[points.length - 1]!;
    const first = points[0]!;
    if (gapPx(first, last, canvasWidth, canvasHeight) <= CLOSED_LOOP_PX) {
      points = points.slice(0, -1);
    }
  }

  return { points, closed: closed && points.length >= 3 };
}

function toPx(p: StrokePoint, canvasWidth: number, canvasHeight: number): Px {
  return { x: p.x * canvasWidth, y: p.y * canvasHeight };
}

/** Centripetal Catmull-Rom (α=0.5) — 빠른 획·불균일 간격에서 uniform보다 overshoot 적음 */
function centripetalControls(p0: Px, p1: Px, p2: Px, p3: Px) {
  const d01 = Math.pow(Math.hypot(p1.x - p0.x, p1.y - p0.y), CATMULL_ALPHA);
  const d12 = Math.pow(Math.hypot(p2.x - p1.x, p2.y - p1.y), CATMULL_ALPHA);
  const d23 = Math.pow(Math.hypot(p3.x - p2.x, p3.y - p2.y), CATMULL_ALPHA);

  const sum01 = d01 + d12;
  const sum12 = d12 + d23;
  if (sum01 < 1e-4 || sum12 < 1e-4) {
    return { cp1x: p1.x, cp1y: p1.y, cp2x: p2.x, cp2y: p2.y };
  }

  const m1x = ((p2.x - p0.x) / sum01) * d12;
  const m1y = ((p2.y - p0.y) / sum01) * d12;
  const m2x = ((p3.x - p1.x) / sum12) * d12;
  const m2y = ((p3.y - p1.y) / sum12) * d12;

  return {
    cp1x: p1.x + m1x / 3,
    cp1y: p1.y + m1y / 3,
    cp2x: p2.x - m2x / 3,
    cp2y: p2.y - m2y / 3,
  };
}

function appendPenSplinePath(
  ctx: CanvasRenderingContext2D,
  trail: StrokePoint[],
  canvasWidth: number,
  canvasHeight: number,
  closed: boolean
) {
  const n = trail.length;
  const at = (i: number) => toPx(trail[i]!, canvasWidth, canvasHeight);

  const first = at(0);
  ctx.moveTo(first.x, first.y);

  if (n === 2) {
    const second = at(1);
    ctx.lineTo(second.x, second.y);
    return;
  }

  const segmentCount = closed ? n : n - 1;

  for (let i = 0; i < segmentCount; i++) {
    const i0 = closed ? (i - 1 + n) % n : Math.max(0, i - 1);
    const i1 = i;
    const i2 = closed ? (i + 1) % n : i + 1;
    const i3 = closed ? (i + 2) % n : Math.min(n - 1, i + 2);

    const p0 = at(i0);
    const p1 = at(i1);
    const p2 = at(i2);
    const p3 = at(i3);

    const { cp1x, cp1y, cp2x, cp2y } = centripetalControls(p0, p1, p2, p3);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
}

/**
 * coalesced 터치 점 + centripetal 스플라인.
 * 닫힌 빠른 원: 주기 경계 + centripetal로 울퉁불퉁함 완화.
 */
export function renderPenPolyline(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  canvasWidth: number,
  canvasHeight: number
) {
  const trail = dedupeTrail(stroke.points);
  if (trail.length === 0) return;

  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  ctx.globalAlpha = 1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (trail.length === 1) {
    const p = trail[0]!;
    const r = penLineWidth(stroke.size, p.pressure ?? 0.5) / 2;
    ctx.beginPath();
    ctx.arc(p.x * canvasWidth, p.y * canvasHeight, r, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  const { points, closed } = prepareTrail(trail, canvasWidth, canvasHeight);

  const avgPressure =
    points.reduce((sum, p) => sum + (p.pressure ?? 0.5), 0) / points.length;

  ctx.beginPath();
  appendPenSplinePath(ctx, points, canvasWidth, canvasHeight, closed);
  ctx.lineWidth = penLineWidth(stroke.size, avgPressure);
  ctx.stroke();
}
