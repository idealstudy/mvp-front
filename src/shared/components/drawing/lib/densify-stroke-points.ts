import type { StrokePoint } from './stroke-input';

/** PF 입력 재샘플 간격(px). 필기감 옵션은 변경하지 않음 */
export const STROKE_DENSIFY_MAX_GAP_PX = 2;

const CATMULL_ALPHA = 0.5;

type Px = { x: number; y: number; pressure: number };

function lerpPressure(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function toPx(p: StrokePoint, pageWidth: number, pageHeight: number): Px {
  return {
    x: p.x * pageWidth,
    y: p.y * pageHeight,
    pressure: p.pressure ?? 0.5,
  };
}

function fromPx(px: Px, pageWidth: number, pageHeight: number): StrokePoint {
  return {
    x: px.x / pageWidth,
    y: px.y / pageHeight,
    pressure: px.pressure,
  };
}

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

function cubicPoint(
  p1: Px,
  cp1x: number,
  cp1y: number,
  cp2x: number,
  cp2y: number,
  p2: Px,
  t: number
): Px {
  const u = 1 - t;
  const u2 = u * u;
  const u3 = u2 * u;
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: u3 * p1.x + 3 * u2 * t * cp1x + 3 * u * t2 * cp2x + t3 * p2.x,
    y: u3 * p1.y + 3 * u2 * t * cp1y + 3 * u * t2 * cp2y + t3 * p2.y,
    pressure: lerpPressure(p1.pressure, p2.pressure, t),
  };
}

function pushIfDistinct(out: StrokePoint[], p: StrokePoint) {
  const last = out[out.length - 1];
  if (
    last &&
    last.x === p.x &&
    last.y === p.y &&
    (last.pressure ?? 0.5) === (p.pressure ?? 0.5)
  ) {
    return;
  }
  out.push(p);
}

/** p1→p2 Catmull 구간을 maxGapPx 간격으로 샘플 (끝점 p2는 호출부에서 추가) */
function sampleCatmullSegment(
  p0: StrokePoint,
  p1: StrokePoint,
  p2: StrokePoint,
  p3: StrokePoint,
  pageWidth: number,
  pageHeight: number,
  maxGapPx: number,
  out: StrokePoint[]
) {
  const px0 = toPx(p0, pageWidth, pageHeight);
  const px1 = toPx(p1, pageWidth, pageHeight);
  const px2 = toPx(p2, pageWidth, pageHeight);
  const px3 = toPx(p3, pageWidth, pageHeight);

  const { cp1x, cp1y, cp2x, cp2y } = centripetalControls(px0, px1, px2, px3);
  const chord = Math.hypot(px2.x - px1.x, px2.y - px1.y);
  const steps = Math.max(1, Math.ceil(chord / maxGapPx));

  for (let s = 1; s < steps; s++) {
    const t = s / steps;
    const px = cubicPoint(px1, cp1x, cp1y, cp2x, cp2y, px2, t);
    pushIfDistinct(out, fromPx(px, pageWidth, pageHeight));
  }
}

/** 3점 이상: 전체 궤적을 Catmull-Rom으로 재샘플 — 빠른 곡선 chord(직선) 방지 */
function resampleCatmullTrail(
  points: StrokePoint[],
  pageWidth: number,
  pageHeight: number,
  maxGapPx: number
): StrokePoint[] {
  const n = points.length;
  const out: StrokePoint[] = [points[0]!];

  for (let i = 0; i < n - 1; i++) {
    const i0 = Math.max(0, i - 1);
    const i1 = i;
    const i2 = i + 1;
    const i3 = Math.min(n - 1, i + 2);

    sampleCatmullSegment(
      points[i0]!,
      points[i1]!,
      points[i2]!,
      points[i3]!,
      pageWidth,
      pageHeight,
      maxGapPx,
      out
    );
    pushIfDistinct(out, points[i2]!);
  }

  return out.length >= 2 ? out : points;
}

function densifyTwoPointTrail(
  points: StrokePoint[],
  pageWidth: number,
  pageHeight: number,
  maxGapPx: number
): StrokePoint[] {
  const prev = points[0]!;
  const curr = points[1]!;
  const gap = Math.hypot(
    (curr.x - prev.x) * pageWidth,
    (curr.y - prev.y) * pageHeight
  );
  if (gap <= maxGapPx) return points;

  const out: StrokePoint[] = [prev];
  const steps = Math.ceil(gap / maxGapPx);
  const p0 = prev.pressure ?? 0.5;
  const p1 = curr.pressure ?? 0.5;
  for (let s = 1; s < steps; s++) {
    const t = s / steps;
    out.push({
      x: prev.x + (curr.x - prev.x) * t,
      y: prev.y + (curr.y - prev.y) * t,
      pressure: lerpPressure(p0, p1, t),
    });
  }
  out.push(curr);
  return out;
}

/**
 * PF 입력 점 밀도 보정. 렌더 옵션(smoothing 등)과 분리.
 * 3점 이상 획은 Catmull-Rom 재샘플, 2점만 직선 보간.
 */
export function densifyLargeGaps(
  points: StrokePoint[],
  pageWidth: number,
  pageHeight: number,
  maxGapPx = STROKE_DENSIFY_MAX_GAP_PX
): StrokePoint[] {
  if (points.length < 2 || pageWidth <= 0 || pageHeight <= 0) {
    return points;
  }
  if (points.length === 2) {
    return densifyTwoPointTrail(points, pageWidth, pageHeight, maxGapPx);
  }
  return resampleCatmullTrail(points, pageWidth, pageHeight, maxGapPx);
}
