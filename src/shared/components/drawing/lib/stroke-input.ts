/** PF 입력 — coalesced + 획 시작 rect 고정 (밀도 보정은 렌더 시 densifyLargeGaps) */

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

/** coalesced만 누적 — 곡선 보간은 렌더 단계에서 일괄(Catmull), WYSIWYG 유지 */
export function appendPointerInput(
  existing: StrokePoint[],
  e: PointerEvent,
  rect: DOMRectReadOnly,
  options: { normalized: boolean; pageWidth: number; pageHeight: number }
): StrokePoint[] {
  return appendCoalescedPoints(existing, e, rect, options);
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
