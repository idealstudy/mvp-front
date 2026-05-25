import { densifyLargeGaps } from './densify-stroke-points';

/** PF 예시·캔버스 공통 — coalesced + 획 시작 rect 고정 */

export type StrokePoint = {
  x: number;
  y: number;
  pressure?: number;
};

export function shouldRecordPointerMove(e: PointerEvent): boolean {
  if (e.pointerType === 'pen') {
    return e.pressure > 0 || (e.buttons & 1) !== 0;
  }
  return e.buttons === 1;
}

function getCoalescedEvents(e: PointerEvent): PointerEvent[] {
  if (typeof e.getCoalescedEvents === 'function') {
    const coalesced = e.getCoalescedEvents();
    if (coalesced.length > 0) return coalesced;
  }
  return [e];
}

function pointFromEvent(
  e: PointerEvent,
  rect: DOMRectReadOnly,
  toNormalized: boolean,
  pageWidth: number,
  pageHeight: number
): StrokePoint {
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  /** tldraw/PF 입력: pressure 0이면 thinning으로 시작이 사라짐 */
  const pressure = e.pressure > 0 ? e.pressure : 0.5;
  if (toNormalized) {
    return { x, y, pressure };
  }
  return {
    x: x * pageWidth,
    y: y * pageHeight,
    pressure,
  };
}

export function appendCoalescedPoints(
  existing: StrokePoint[],
  e: PointerEvent,
  rect: DOMRectReadOnly,
  options: { normalized: boolean; pageWidth: number; pageHeight: number }
): StrokePoint[] {
  const next = [...existing];
  for (const ev of getCoalescedEvents(e)) {
    const p = pointFromEvent(
      ev,
      rect,
      options.normalized,
      options.pageWidth,
      options.pageHeight
    );
    const last = next[next.length - 1];
    if (
      last &&
      last.x === p.x &&
      last.y === p.y &&
      last.pressure === p.pressure
    ) {
      continue;
    }
    next.push(p);
  }
  if (next.length === 0) {
    next.push(
      pointFromEvent(
        e,
        rect,
        options.normalized,
        options.pageWidth,
        options.pageHeight
      )
    );
  }
  return next;
}

/** coalesced가 비어 있는 iPad 등 — move마다 간격 보간 후 저장 */
export function appendPointerInput(
  existing: StrokePoint[],
  e: PointerEvent,
  rect: DOMRectReadOnly,
  options: { normalized: boolean; pageWidth: number; pageHeight: number },
  maxGapPx = 4
): StrokePoint[] {
  const next = appendCoalescedPoints(existing, e, rect, options);
  return densifyLargeGaps(
    next,
    options.pageWidth,
    options.pageHeight,
    maxGapPx
  );
}

export function mergePointLists(...groups: StrokePoint[][]): StrokePoint[] {
  const merged: StrokePoint[] = [];
  for (const group of groups) {
    for (const p of group) {
      const last = merged[merged.length - 1];
      if (
        last &&
        last.x === p.x &&
        last.y === p.y &&
        last.pressure === p.pressure
      ) {
        continue;
      }
      merged.push(p);
    }
  }
  return merged;
}
