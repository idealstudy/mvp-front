import type { StrokeOptions } from 'perfect-freehand';

import type { Stroke } from '../types';

export function getStrokeRenderOptions(
  stroke: Stroke,
  isComplete = true
): StrokeOptions {
  const size = stroke.tool === 'highlighter' ? stroke.size * 3 : stroke.size;

  /** 펜은 renderPenPolyline 사용 — PF 미적용 */

  return {
    size,
    thinning: 0,
    smoothing: isComplete ? 0.5 : 0,
    streamline: 0.5,
    simulatePressure: true,
    start: { cap: true, taper: 0 },
    end: { cap: true, taper: 0 },
    last: isComplete,
  };
}
