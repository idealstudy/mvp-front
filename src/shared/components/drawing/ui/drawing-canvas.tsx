'use client';

import { useRef } from 'react';

import { cn } from '@/shared/lib';

import { useDrawingCanvas } from '../model/use-drawing-canvas';
import type { DrawingTool, PageSize, Stroke } from '../types';

type DrawingCanvasProps = {
  strokes: Stroke[];
  tool: DrawingTool;
  color: string;
  size: number;
  pageSize: PageSize;
  onStrokeAdd: (stroke: Stroke) => void;
  onStrokeErase: (ids: string[]) => void;
  className?: string;
};

export function DrawingCanvas({
  strokes,
  tool,
  color,
  size,
  pageSize,
  onStrokeAdd,
  onStrokeErase,
  className,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { handlePointerDown, handlePointerMove, handlePointerUp } =
    useDrawingCanvas({
      canvasRef,
      strokes,
      tool,
      color,
      size,
      pageSize,
      onStrokeAdd,
      onStrokeErase,
    });

  const cursorClass =
    tool === 'eraser'
      ? 'cursor-cell'
      : tool === 'highlighter'
        ? 'cursor-crosshair'
        : 'cursor-crosshair';

  return (
    <canvas
      ref={canvasRef}
      width={pageSize.width}
      height={pageSize.height}
      className={cn('absolute inset-0 touch-none', cursorClass, className)}
      style={{ width: pageSize.width, height: pageSize.height }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
}
