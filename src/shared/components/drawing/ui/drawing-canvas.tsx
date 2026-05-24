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

  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handlePointerLeave,
  } = useDrawingCanvas({
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
    tool === 'select'
      ? 'cursor-default'
      : tool === 'eraser'
        ? 'cursor-cell'
        : 'cursor-crosshair';

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'pen' || e.pointerType === 'mouse') {
      e.preventDefault();
    }
    handlePointerDown(e.nativeEvent);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'pen' && (e.buttons & 1) === 1) {
      e.preventDefault();
    }
    handlePointerMove(e.nativeEvent);
  };

  return (
    <canvas
      ref={canvasRef}
      width={pageSize.width}
      height={pageSize.height}
      className={cn('absolute inset-0 touch-none', cursorClass, className)}
      style={{
        width: pageSize.width,
        height: pageSize.height,
        touchAction: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => handlePointerUp(e.nativeEvent)}
      onPointerCancel={(e) => handlePointerCancel(e.nativeEvent)}
      onPointerLeave={(e) => handlePointerLeave(e.nativeEvent)}
    />
  );
}
