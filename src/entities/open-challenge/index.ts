import { domain } from '@/entities/open-challenge/core';
import { dto, payload } from '@/entities/open-challenge/infrastructure';

export * from './infrastructure';
export * from './core';
export * from './types';

export const openChallenge = {
  dto,
  domain,
  payload,
};
