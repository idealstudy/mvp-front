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

function isDrawingSurface(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest('[data-drawing-surface]'));
}

/**
 * Apple Pencil 필기 시 페이지 텍스트가 선택되면 iPad 왼쪽 위에
 * "공유" UI가 뜨고 pointer 이벤트가 끊길 수 있습니다.
 */
export function PenSelectGuard() {
  useEffect(() => {
    let penPointerActive = false;

    const onSelectionChange = () => {
      if (isEditableTarget(document.activeElement)) return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;
      const anchor = sel.anchorNode;
      if (
        !penPointerActive &&
        !isDrawingSurface(anchor) &&
        !isDrawingSurface(document.activeElement)
      ) {
        return;
      }
      clearDocumentSelection();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'pen') penPointerActive = true;
      if (e.pointerType !== 'pen' && e.pointerType !== 'mouse') return;
      if (isEditableTarget(e.target)) return;
      clearDocumentSelection();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'pen') penPointerActive = false;
    };

    const onPointerCancel = (e: PointerEvent) => {
      if (e.pointerType === 'pen') penPointerActive = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'pen' || !penPointerActive) return;
      if (isEditableTarget(e.target)) return;
      if (!isDrawingSurface(e.target)) return;
      clearDocumentSelection();
    };

    const onSelectStart = (e: Event) => {
      if (isEditableTarget(e.target)) return;
      if (isDrawingSurface(e.target) || penPointerActive) {
        e.preventDefault();
        clearDocumentSelection();
      }
    };

    const onContextMenu = (e: Event) => {
      if (!(e.target instanceof Element)) return;
      if (!isDrawingSurface(e.target)) return;
      e.preventDefault();
    };

    document.addEventListener('selectionchange', onSelectionChange);
    document.addEventListener('pointerdown', onPointerDown, {
      capture: true,
    });
    document.addEventListener('pointerup', onPointerUp, {
      capture: true,
    });
    document.addEventListener('pointercancel', onPointerCancel, {
      capture: true,
    });
    document.addEventListener('pointermove', onPointerMove, {
      capture: true,
      passive: true,
    });
    document.addEventListener('selectstart', onSelectStart, {
      capture: true,
    });
    document.addEventListener('contextmenu', onContextMenu, {
      capture: true,
    });

    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
      document.removeEventListener('pointerdown', onPointerDown, {
        capture: true,
      });
      document.removeEventListener('pointerup', onPointerUp, {
        capture: true,
      });
      document.removeEventListener('pointercancel', onPointerCancel, {
        capture: true,
      });
      document.removeEventListener('pointermove', onPointerMove, {
        capture: true,
      });
      document.removeEventListener('selectstart', onSelectStart, {
        capture: true,
      });
      document.removeEventListener('contextmenu', onContextMenu, {
        capture: true,
      });
    };
  }, []);

  return null;
}
