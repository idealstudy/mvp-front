import type { StrokeOptions } from 'perfect-freehand';

import type { Stroke } from '../types';

export function getStrokeRenderOptions(
  stroke: Stroke,
  isComplete = true
): StrokeOptions {
  const size = stroke.tool === 'highlighter' ? stroke.size * 3 : stroke.size;

  /**
   * 펜: 필기 중·완성 후 동일한 PF 변형 — 매 프레임 완성 획과 같은 smoothing/streamline 적용.
   * (라이브만 0 / 완성만 0.5 분기는 필기 후 획이 당겨지거나, 라이브만 각져 보임)
   */
  if (stroke.tool === 'pen') {
    return {
      size,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
      simulatePressure: true,
      start: { cap: true, taper: 0 },
      end: { cap: true, taper: 0 },
      last: true,
    };
  }

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
