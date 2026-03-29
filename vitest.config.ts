import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    globals: true,
    exclude: ['**/node_modules/**', 'e2e/**'],
  },
  define: {
    'process.env.NEXT_PUBLIC_BASE_URL': JSON.stringify(
      'http://localhost/mock-api'
    ),
    // 테스트 환경용 백엔드 API URL 설정
    // 실제 서버가 필요 없음 (MSW mock 서버 사용)
    // 빌드 시 환경 변수 체크를 통과하기 위한 더미 값
    'process.env.NEXT_PUBLIC_BACKEND_API_URL': JSON.stringify(
      'http://localhost:8080'
    ),
    'process.env.BACKEND_API_URL': JSON.stringify('http://localhost:8080'),
  },
});
