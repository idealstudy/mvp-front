import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_GLITCHTIP_DSN,
      environment: process.env.NEXT_PUBLIC_ENV,
      tracesSampleRate: 0.01,
    });
  }
}
