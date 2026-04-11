import type { NextConfig } from 'next';

import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['app.dev.the-edu.site', '*.dev.the-edu.site'],
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

export default withSentryConfig(nextConfig, {
  silent: true,
  telemetry: false,
  widenClientFileUpload: true,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: 'dedu',
  project: 'dedu',
  sentryUrl: 'https://app.glitchtip.com',
});
