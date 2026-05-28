import type { PageSize, Point } from '../types';

/**
 * Tap/짧은 획만 최소 길이로 보정한다.
 * 3점 이상이면서 시작·끝이 가까운 경우(닫힌 루프)는 점으로 접지 않는다.
 */
export function ensureMinPoints(
  points: Point[],
  pageSize: PageSize,
  strokeSize: number
): Point[] {
  if (points.length === 0) return points;

  const minPx = Math.max(strokeSize * 2, 8);
  const offsetX = minPx / pageSize.width;
  const offsetY = minPx / pageSize.height;

  if (points.length === 1) {
    const p = points[0]!;
    return [
      p,
      {
        x: p.x + offsetX * 0.15,
        y: p.y + offsetY * 0.15,
        pressure: p.pressure ?? 0.5,
      },
    ];
  }

  if (points.length >= 3) return points;

  const first = points[0]!;
  const last = points[points.length - 1]!;
  const dx = (last.x - first.x) * pageSize.width;
  const dy = (last.y - first.y) * pageSize.height;
  if (Math.hypot(dx, dy) >= minPx) return points;

  return [
    first,
    {
      x: first.x + offsetX * 0.15,
      y: first.y + offsetY * 0.15,
      pressure: last.pressure ?? first.pressure ?? 0.5,
    },
  ];
}
