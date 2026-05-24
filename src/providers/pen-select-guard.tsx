'use client';

import { useEffect } from 'react';

function clearDocumentSelection() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
  sel.removeAllRanges();
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest('input, textarea, [contenteditable="true"]'));
}

/**
 * Apple Pencil 필기 시 페이지 텍스트가 선택되면 iPad 왼쪽 위에
 * "공유" UI가 뜨고 pointer 이벤트가 끊길 수 있습니다.
 * selectionchange뿐 아니라 pointerdown·selectstart에서 막습니다.
 */
export function PenSelectGuard() {
  useEffect(() => {
    const onSelectionChange = () => {
      if (isEditableTarget(document.activeElement)) return;
      clearDocumentSelection();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'pen' && e.pointerType !== 'mouse') return;
      if (isEditableTarget(e.target)) return;
      clearDocumentSelection();
    };

    const onSelectStart = (e: Event) => {
      if (isEditableTarget(e.target)) return;
      if (
        e.target instanceof Element &&
        e.target.closest('[data-drawing-surface]')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('selectionchange', onSelectionChange);
    document.addEventListener('pointerdown', onPointerDown, {
      capture: true,
    });
    document.addEventListener('selectstart', onSelectStart, {
      capture: true,
    });

    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
      document.removeEventListener('pointerdown', onPointerDown, {
        capture: true,
      });
      document.removeEventListener('selectstart', onSelectStart, {
        capture: true,
      });
    };
  }, []);

  return null;
}
