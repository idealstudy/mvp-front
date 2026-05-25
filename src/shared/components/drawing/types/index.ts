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
