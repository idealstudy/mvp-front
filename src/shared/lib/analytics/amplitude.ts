import * as amplitude from '@amplitude/analytics-browser';

let initialized = false;

export const initAmplitude = (): void => {
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV !== 'production') return;
  if (initialized) return;

  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
  if (!apiKey) return;

  amplitude.init(apiKey, {
    defaultTracking: {
      sessions: true,
    },
  });

  initialized = true;
};

export const trackAmplitudeEvent = (
  eventName: string,
  properties?: Record<string, unknown>
): void => {
  if (typeof window === 'undefined') return;
  amplitude.track(eventName, properties);
};

export const setAmplitudeUser = (userId: string): void => {
  if (typeof window === 'undefined') return;
  amplitude.setUserId(userId);
};

export const setAmplitudeUserProperties = (
  properties: Record<string, unknown>
): void => {
  if (typeof window === 'undefined') return;
  const identifyEvent = new amplitude.Identify();
  Object.entries(properties).forEach(([key, value]) => {
    identifyEvent.set(key, value as amplitude.Types.ValidPropertyType);
  });
  amplitude.identify(identifyEvent);
};

export const resetAmplitudeUser = (): void => {
  if (typeof window === 'undefined') return;
  amplitude.reset();
};
