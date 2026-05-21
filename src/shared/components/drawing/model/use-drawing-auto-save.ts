import { useCallback, useEffect, useRef, useState } from 'react';

import type { Stroke } from '../types';
import { savePageStrokes } from './drawing-storage';

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type UseDrawingAutoSaveOptions = {
  documentId: string;
  pageNumber: number;
  debounceMs?: number;
};

type UseDrawingAutoSaveReturn = {
  status: AutoSaveStatus;
  triggerSave: (strokes: Stroke[]) => void;
};

export function useDrawingAutoSave({
  documentId,
  pageNumber,
  debounceMs = 700,
}: UseDrawingAutoSaveOptions): UseDrawingAutoSaveReturn {
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<Stroke[]>([]);

  const flush = useCallback(async () => {
    setStatus('saving');
    try {
      await savePageStrokes(documentId, pageNumber, pendingRef.current);
      setStatus('saved');
      setTimeout(() => setStatus((s) => (s === 'saved' ? 'idle' : s)), 2000);
    } catch {
      setStatus('error');
    }
  }, [documentId, pageNumber]);

  const triggerSave = useCallback(
    (strokes: Stroke[]) => {
      pendingRef.current = strokes;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flush, debounceMs);
    },
    [flush, debounceMs]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { status, triggerSave };
}
