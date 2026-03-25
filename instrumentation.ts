import { AuthError } from '@/shared/lib';
import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      enabled: process.env.NODE_ENV !== 'development',
      dsn: process.env.NEXT_PUBLIC_GLITCHTIP_DSN,
      environment: process.env.NEXT_PUBLIC_ENV,
      tracesSampleRate: 0.01,
      beforeSend(event, hint) {
        const error = hint.originalException;

        if (error instanceof AuthError) return null;

        if (axios.isAxiosError(error)) {
          if (!error.response) return null; // 네트워크 에러
          const status = error.response.status;
          if (status >= 400 && status < 500) return null; // 4xx
        }

        return event;
      },
    });
  }
}
