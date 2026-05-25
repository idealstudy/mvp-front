import type { StrokeOptions } from 'perfect-freehand';

import type { Stroke } from '../types';

/** live·완료 동일 — pointerup 후 획이 바뀌지 않게(WYSIWYG) */
export function getStrokeRenderOptions(stroke: Stroke): StrokeOptions {
  const size = stroke.tool === 'highlighter' ? stroke.size * 3 : stroke.size;
  const isPen = stroke.tool === 'pen';

  return {
    size,
    thinning: isPen ? 0.5 : 0,
    smoothing: 0.5,
    streamline: 0.5,
    simulatePressure: true,
    start: { cap: true, taper: 0 },
    end: { cap: true, taper: 0 },
    last: true,
  };
}
