import { useCallback, useState } from 'react';

import type { Stroke } from '../types';

type HistoryEntry =
  | { type: 'add'; stroke: Stroke }
  | { type: 'erase'; strokes: Stroke[] };

type UseStrokesReturn = {
  strokes: Stroke[];
  addStroke: (stroke: Stroke) => void;
  eraseStrokes: (ids: string[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  setStrokes: (strokes: Stroke[]) => void;
  clearStrokes: () => void;
};

export function useStrokes(): UseStrokesReturn {
  const [strokes, setStrokesState] = useState<Stroke[]>([]);
  const [undoStack, setUndoStack] = useState<HistoryEntry[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryEntry[]>([]);

  const addStroke = useCallback((stroke: Stroke) => {
    setStrokesState((prev) => [...prev, stroke]);
    setUndoStack((prev) => [...prev, { type: 'add', stroke }]);
    setRedoStack([]);
  }, []);

  const eraseStrokes = useCallback((ids: string[]) => {
    setStrokesState((prev) => {
      const erased = prev.filter((s) => ids.includes(s.id));
      if (erased.length === 0) return prev;
      setUndoStack((stack) => [...stack, { type: 'erase', strokes: erased }]);
      setRedoStack([]);
      return prev.filter((s) => !ids.includes(s.id));
    });
  }, []);

  const undo = useCallback(() => {
    setUndoStack((stack) => {
      if (stack.length === 0) return stack;

      const entry = stack[stack.length - 1]!;
      const next = stack.slice(0, -1);

      if (entry.type === 'add') {
        setStrokesState((prev) => prev.filter((s) => s.id !== entry.stroke.id));
        setRedoStack((r) => [...r, entry]);
      } else {
        setStrokesState((prev) => [...prev, ...entry.strokes]);
        setRedoStack((r) => [...r, entry]);
      }

      return next;
    });
  }, []);

  const redo = useCallback(() => {
    setRedoStack((stack) => {
      if (stack.length === 0) return stack;

      const entry = stack[stack.length - 1]!;
      const next = stack.slice(0, -1);

      if (entry.type === 'add') {
        setStrokesState((prev) => [...prev, entry.stroke]);
        setUndoStack((u) => [...u, entry]);
      } else {
        setStrokesState((prev) =>
          prev.filter((s) => !entry.strokes.some((e: Stroke) => e.id === s.id))
        );
        setUndoStack((u) => [...u, entry]);
      }

      return next;
    });
  }, []);

  const setStrokes = useCallback((next: Stroke[]) => {
    setStrokesState(next);
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  const clearStrokes = useCallback(() => {
    setStrokesState([]);
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  return {
    strokes,
    addStroke,
    eraseStrokes,
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    setStrokes,
    clearStrokes,
  };
}
