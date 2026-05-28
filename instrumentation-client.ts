import { AuthError } from '@/shared/lib';
import axios from 'axios';

const shouldEnableSentry = process.env.NEXT_PUBLIC_ENABLE_SENTRY === 'true';

if (shouldEnableSentry) {
  void import('@sentry/nextjs').then((Sentry) => {
    Sentry.init({
      enabled: shouldEnableSentry,
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
  });
}
