import type { StrokePoint } from './stroke-input';

/** 연속 샘플 간격이 maxGapPx보다 크면 보간 — 빠른 획 앞부분 누락 방지 */
export function densifyLargeGaps(
  points: StrokePoint[],
  pageWidth: number,
  pageHeight: number,
  maxGapPx = 4
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
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        const p0 = prev.pressure ?? 0.5;
        const p1 = curr.pressure ?? 0.5;
        out.push({
          x: prev.x + (curr.x - prev.x) * t,
          y: prev.y + (curr.y - prev.y) * t,
          pressure: p0 + (p1 - p0) * t,
        });
      }
    }

    out.push(curr);
  }

  return out;
}
