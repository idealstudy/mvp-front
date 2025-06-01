import { server } from '@/mocks/node';
import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

beforeAll(() => {
  server.listen();

  vi.mock('next/navigation', () => import('next-router-mock'));
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
