import type { StrokeOptions } from 'perfect-freehand';

import type { Stroke } from '../types';

export function getStrokeRenderOptions(
  stroke: Stroke,
  isComplete = true
): StrokeOptions {
  const size = stroke.tool === 'highlighter' ? stroke.size * 3 : stroke.size;
  const isPen = stroke.tool === 'pen';
  return {
    size,
    thinning: stroke.tool === 'highlighter' ? 0 : 0.5,
    /** 필기 중(live) 펜: smoothing/streamline 0 — 빠른 획 시작이 당겨지지 않음 */
    smoothing:
      stroke.tool === 'highlighter'
        ? isComplete
          ? 0.5
          : 0
        : isPen && !isComplete
          ? 0
          : 0.5,
    streamline:
      stroke.tool === 'highlighter' ? 0.5 : isPen && !isComplete ? 0 : 0.5,
    /** HEAD와 동일 — 펜은 clamped pressure + simulatePressure */
    simulatePressure: true,
    start: { cap: true, taper: 0 },
    end: { cap: true, taper: 0 },
    last: isComplete,
  };
}
