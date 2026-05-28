export type Point = {
  x: number;
  y: number;
  pressure?: number;
};

export type Stroke = {
  id: string;
  pageNumber: number;
  points: Point[];
  color: string;
  size: number;
  tool: DrawingTool;
  /**
   * y(0~1)가 기준으로 삼는 캔버스 높이(px).
   * 렌더 시 `y * layoutHeight`로 쓰며, 확장으로 늘어난 canvasHeight와 무관하게 픽셀 위치·길이를 유지한다.
   */
  layoutHeight?: number;
};

export type DrawingTool = 'pen' | 'highlighter' | 'eraser';

export type DrawingState = {
  tool: DrawingTool;
  color: string;
  size: number;
  strokes: Stroke[];
  currentPageNumber: number;
};

export type DrawingSaveData = {
  documentId: string;
  pageNumber: number;
  strokes: Stroke[];
  updatedAt: string;
};

export type PageSize = {
  width: number;
  height: number;
};
