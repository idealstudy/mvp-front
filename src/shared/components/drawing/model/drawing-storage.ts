import { type IDBPDatabase, openDB } from 'idb';

import type { DrawingSaveData, Stroke } from '../types';

const DB_NAME = 'drawing-db';
const STORE_NAME = 'strokes';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

function buildKey(documentId: string, pageNumber: number): string {
  return `${documentId}:${pageNumber}`;
}

export async function savePageStrokes(
  documentId: string,
  pageNumber: number,
  strokes: Stroke[]
): Promise<void> {
  const db = await getDb();
  const data: DrawingSaveData = {
    documentId,
    pageNumber,
    strokes,
    updatedAt: new Date().toISOString(),
  };
  await db.put(STORE_NAME, data, buildKey(documentId, pageNumber));
}

export async function loadPageStrokes(
  documentId: string,
  pageNumber: number
): Promise<Stroke[]> {
  const db = await getDb();
  const data: DrawingSaveData | undefined = await db.get(
    STORE_NAME,
    buildKey(documentId, pageNumber)
  );
  return data?.strokes ?? [];
}

export async function saveCanvasHeight(
  documentId: string,
  height: number
): Promise<void> {
  const db = await getDb();
  await db.put(
    STORE_NAME,
    { height, updatedAt: new Date().toISOString() },
    `${documentId}:canvas-meta`
  );
}

export async function loadCanvasHeight(
  documentId: string
): Promise<number | null> {
  const db = await getDb();
  const data = await db.get(STORE_NAME, `${documentId}:canvas-meta`);
  return (data as { height: number } | undefined)?.height ?? null;
}

export async function clearDocumentStrokes(documentId: string): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const keys = await tx.store.getAllKeys();
  const prefix = `${documentId}:`;
  await Promise.all(
    keys
      .filter((k) => String(k).startsWith(prefix))
      .map((k) => tx.store.delete(k))
  );
  await tx.done;
}
