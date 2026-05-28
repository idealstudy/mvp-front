import type { NextConfig } from 'next';

import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['app.dev.the-edu.site', '*.dev.the-edu.site'],
  images: {
    // 홈 고정 폭 이미지는 2x 후보가 기본 640/750px까지 커지지 않도록 보정한다.
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 324, 384, 400, 600, 648],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'theedu.s3.ap-northeast-2.amazonaws.com',
      },
    ],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
const shouldEnableSentry = process.env.NEXT_PUBLIC_ENABLE_SENTRY === 'true';

const sentryOptions = {
  silent: true,
  telemetry: false,
  widenClientFileUpload: true,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: 'dedu',
  project: 'dedu',
  sentryUrl: 'https://app.glitchtip.com',
};

export default shouldEnableSentry
  ? withSentryConfig(nextConfig, sentryOptions)
  : nextConfig;
