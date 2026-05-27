import { useCallback, useReducer } from 'react';

import type { Stroke } from '../types';

type HistoryEntry =
  | { type: 'add'; stroke: Stroke }
  | { type: 'erase'; strokes: Stroke[] };

type StrokesState = {
  strokes: Stroke[];
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
};

type StrokesAction =
  | { type: 'add'; stroke: Stroke }
  | { type: 'erase'; ids: string[] }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'set'; strokes: Stroke[] }
  | { type: 'mapAll'; mapper: (stroke: Stroke) => Stroke }
  | { type: 'clear' };

const initialState: StrokesState = {
  strokes: [],
  undoStack: [],
  redoStack: [],
};

function strokesReducer(
  state: StrokesState,
  action: StrokesAction
): StrokesState {
  switch (action.type) {
    case 'add':
      return {
        strokes: [...state.strokes, action.stroke],
        undoStack: [...state.undoStack, { type: 'add', stroke: action.stroke }],
        redoStack: [],
      };
    case 'erase': {
      const idSet = new Set(action.ids);
      const erased = state.strokes.filter((s) => idSet.has(s.id));
      if (erased.length === 0) return state;
      return {
        strokes: state.strokes.filter((s) => !idSet.has(s.id)),
        undoStack: [...state.undoStack, { type: 'erase', strokes: erased }],
        redoStack: [],
      };
    }
    case 'undo': {
      if (state.undoStack.length === 0) return state;
      const entry = state.undoStack[state.undoStack.length - 1]!;
      const undoStack = state.undoStack.slice(0, -1);
      const redoStack = [...state.redoStack, entry];

      if (entry.type === 'add') {
        return {
          strokes: state.strokes.filter((s) => s.id !== entry.stroke.id),
          undoStack,
          redoStack,
        };
      }

      return {
        strokes: [...state.strokes, ...entry.strokes],
        undoStack,
        redoStack,
      };
    }
    case 'redo': {
      if (state.redoStack.length === 0) return state;
      const entry = state.redoStack[state.redoStack.length - 1]!;
      const redoStack = state.redoStack.slice(0, -1);
      const undoStack = [...state.undoStack, entry];

      if (entry.type === 'add') {
        return {
          strokes: [...state.strokes, entry.stroke],
          undoStack,
          redoStack,
        };
      }

      const eraseIds = new Set(entry.strokes.map((s) => s.id));
      return {
        strokes: state.strokes.filter((s) => !eraseIds.has(s.id)),
        undoStack,
        redoStack,
      };
    }
    case 'set':
      return { strokes: action.strokes, undoStack: [], redoStack: [] };
    case 'mapAll':
      return {
        strokes: state.strokes.map(action.mapper),
        undoStack: state.undoStack.map((entry) =>
          entry.type === 'add'
            ? { type: 'add', stroke: action.mapper(entry.stroke) }
            : { type: 'erase', strokes: entry.strokes.map(action.mapper) }
        ),
        redoStack: state.redoStack.map((entry) =>
          entry.type === 'add'
            ? { type: 'add', stroke: action.mapper(entry.stroke) }
            : { type: 'erase', strokes: entry.strokes.map(action.mapper) }
        ),
      };
    case 'clear':
      return initialState;
    default:
      return state;
  }
}

type UseStrokesReturn = {
  strokes: Stroke[];
  addStroke: (stroke: Stroke) => void;
  eraseStrokes: (ids: string[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  setStrokes: (strokes: Stroke[]) => void;
  mapAllStrokes: (mapper: (stroke: Stroke) => Stroke) => void;
  clearStrokes: () => void;
};

export function useStrokes(): UseStrokesReturn {
  const [state, dispatch] = useReducer(strokesReducer, initialState);

  const addStroke = useCallback((stroke: Stroke) => {
    dispatch({ type: 'add', stroke });
  }, []);

  const eraseStrokes = useCallback((ids: string[]) => {
    dispatch({ type: 'erase', ids });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'undo' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'redo' });
  }, []);

  const setStrokes = useCallback((strokes: Stroke[]) => {
    dispatch({ type: 'set', strokes });
  }, []);

  const mapAllStrokes = useCallback((mapper: (stroke: Stroke) => Stroke) => {
    dispatch({ type: 'mapAll', mapper });
  }, []);

  const clearStrokes = useCallback(() => {
    dispatch({ type: 'clear' });
  }, []);

  return {
    strokes: state.strokes,
    addStroke,
    eraseStrokes,
    undo,
    redo,
    canUndo: state.undoStack.length > 0,
    canRedo: state.redoStack.length > 0,
    setStrokes,
    mapAllStrokes,
    clearStrokes,
  };
}
