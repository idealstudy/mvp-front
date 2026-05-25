import type { StrokePoint } from './stroke-input';

/** 인접 샘플 최대 간격(px). 2px는 촘촘한 직선 점만 늘려 더 각져 보임 — 4 유지 */
export const STROKE_DENSIFY_MAX_GAP_PX = 4;

/** 이 간격(px) 초과 구간은 직선 보간 대신 곡선(2차 베지어) 샘플 */
const SMOOTH_GAP_PX = 12;

function lerpPressure(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function pushLinearSteps(
  out: StrokePoint[],
  from: StrokePoint,
  to: StrokePoint,
  steps: number
) {
  const p0 = from.pressure ?? 0.5;
  const p1 = to.pressure ?? 0.5;
  for (let s = 1; s < steps; s++) {
    const t = s / steps;
    out.push({
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
      pressure: lerpPressure(p0, p1, t),
    });
  }
}

/** 이전 진행 방향을 제어점으로 — 빠른 획의 직선 chord 보간 완화 */
function pushQuadraticSteps(
  out: StrokePoint[],
  from: StrokePoint,
  to: StrokePoint,
  fromPrev: StrokePoint,
  steps: number
) {
  const cx = from.x + (from.x - fromPrev.x) * 0.4;
  const cy = from.y + (from.y - fromPrev.y) * 0.4;
  const p0 = from.pressure ?? 0.5;
  const p1 = to.pressure ?? 0.5;

  for (let s = 1; s < steps; s++) {
    const t = s / steps;
    const u = 1 - t;
    out.push({
      x: u * u * from.x + 2 * u * t * cx + t * t * to.x,
      y: u * u * from.y + 2 * u * t * cy + t * t * to.y,
      pressure: lerpPressure(p0, p1, t),
    });
  }
}

/** 연속 샘플 간격이 maxGapPx보다 크면 보간 — 빠른 획 앞부분·직선 구간 방지 */
export function densifyLargeGaps(
  points: StrokePoint[],
  pageWidth: number,
  pageHeight: number,
  maxGapPx = STROKE_DENSIFY_MAX_GAP_PX
): StrokePoint[] {
  if (points.length < 2 || pageWidth <= 0 || pageHeight <= 0) {
    return points;
  }

  const out: StrokePoint[] = [points[0]!];

  for (let i = 1; i < points.length; i++) {
    const prev = out[out.length - 1]!;
    const curr = points[i]!;
    const gap = Math.hypot(
      (curr.x - prev.x) * pageWidth,
      (curr.y - prev.y) * pageHeight
    );

    if (gap > maxGapPx) {
      const steps = Math.ceil(gap / maxGapPx);
      const prevPrev = out[out.length - 2];
      if (gap >= SMOOTH_GAP_PX && prevPrev) {
        pushQuadraticSteps(out, prev, curr, prevPrev, steps);
      } else {
        pushLinearSteps(out, prev, curr, steps);
      }
    }

    out.push(curr);
  }

  return out;
}
