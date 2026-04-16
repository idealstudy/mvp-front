import { trackAmplitudeEvent } from './amplitude';
import { pushToDataLayer } from './gtm';

export const track = (
  event: string,
  params?: Record<string, unknown>
): void => {
  try {
    pushToDataLayer(event, params);
  } catch {}
  try {
    trackAmplitudeEvent(event, params);
  } catch {}
};
