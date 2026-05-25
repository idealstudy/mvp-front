'use client';

import { useEffect, useRef } from 'react';

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
  capturePointerSession?: boolean;
  className?: string;
};

function isStylusTouch(touch: Touch): boolean {
  return (touch as Touch & { touchType?: string }).touchType === 'stylus';
}

export function DrawingCanvas({
  strokes,
  tool,
  color,
  size,
  pageSize,
  onStrokeAdd,
  onStrokeErase,
  capturePointerSession,
  className,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { handlePointerUp, handlePointerCancel, handlePointerLeave } =
    useDrawingCanvas({
      canvasRef,
      strokes,
      tool,
      color,
      size,
      pageSize,
      onStrokeAdd,
      onStrokeErase,
      capturePointerSession,
    });

  /**
   * iPadOS Scribble가 pointer 이벤트를 삼키는 WebKit 버그 우회.
   * @see https://mikepk.com/2020/10/iOS-safari-scribble-bug/
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch && isStylusTouch(touch)) {
        e.preventDefault();
      }
    };

    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => canvas.removeEventListener('touchmove', onTouchMove);
  }, []);

  const cursorClass =
    tool === 'select'
      ? 'cursor-default'
      : tool === 'eraser'
        ? 'cursor-cell'
        : 'cursor-crosshair';

  return (
    <canvas
      ref={canvasRef}
      data-drawing-surface
      width={pageSize.width}
      height={pageSize.height}
      className={cn('absolute inset-0 touch-none', cursorClass, className)}
      style={{
        width: pageSize.width,
        height: pageSize.height,
        touchAction: 'none',
      }}
      onPointerUp={(e) => handlePointerUp(e.nativeEvent)}
      onPointerCancel={(e) => handlePointerCancel(e.nativeEvent)}
      onPointerLeave={(e) => handlePointerLeave(e.nativeEvent)}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
