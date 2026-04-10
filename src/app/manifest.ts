import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '디에듀',
    short_name: '디에듀',
    description: '수업 기록부터 학생 관리까지 한 곳에서',
    start_url: '/',
    display: 'standalone',
    background_color: '#F9F9F9',
    theme_color: '#F9F9F9',
    lang: 'ko',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
