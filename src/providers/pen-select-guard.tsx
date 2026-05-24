'use client';

import { useEffect } from 'react';

/**
 * input/textarea/contenteditable 외부에서 발생하는 텍스트 선택을 즉시 제거합니다.
 * 손바닥이 펜보다 먼저 닿는 경우에도 selectionchange 시점에 반응하므로 타이밍 문제가 없습니다.
 */
export function PenSelectGuard() {
  useEffect(() => {
    const onSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;

      const range = sel.getRangeAt(0);
      const node = range.commonAncestorContainer;
      const el =
        node.nodeType === Node.TEXT_NODE
          ? node.parentElement
          : (node as Element);

      // input / textarea / contenteditable 안이면 선택 허용
      if (el?.closest('input, textarea, [contenteditable]')) return;

      sel.removeAllRanges();
    };

    document.addEventListener('selectionchange', onSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, []);

  return null;
}
