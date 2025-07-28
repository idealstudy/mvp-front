import { getSessionToken } from '@/features/auth/services/session-token';
import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';

import { AuthError, ForbiddenError } from './error';

export const BASE_URL = 'https://dev.the-edu.site/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const sessionToken = getSessionToken();

  if (sessionToken) {
    config.headers.Authorization = `Bearer ${sessionToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.status === 401) {
      throw new AuthError(error.response.data.message);
    }

    if (error.status === 403) {
      throw new ForbiddenError(error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export const api = {
  get: async <TResponse = unknown>(
    ...args: Parameters<AxiosInstance['get']>
  ) => {
    const response = await apiClient.get<TResponse>(...args);
    return response.data;
  },
  post: async <TResponse = unknown>(
    ...args: Parameters<AxiosInstance['post']>
  ) => {
    const response = await apiClient.post<TResponse>(...args);
    return response.data;
  },
  put: async <TResponse = unknown>(
    ...args: Parameters<AxiosInstance['put']>
  ) => {
    const response = await apiClient.put<TResponse>(...args);
    return response.data;
  },
  patch: async <TResponse = unknown>(
    ...args: Parameters<AxiosInstance['patch']>
  ) => {
    const response = await apiClient.patch<TResponse>(...args);
    return response.data;
  },
  postForm: async <TResponse = unknown>(
    ...args: Parameters<AxiosInstance['postForm']>
  ) => {
    const response = await apiClient.postForm<TResponse>(...args);
    return response.data;
  },
  patchForm: async <TResponse = unknown>(
    ...args: Parameters<AxiosInstance['patchForm']>
  ) => {
    const response = await apiClient.patchForm<TResponse>(...args);
    return response.data;
  },
  delete: async <TResponse = unknown>(
    ...args: Parameters<AxiosInstance['delete']>
  ) => {
    const response = await apiClient.delete<TResponse>(...args);
    return response.data;
  },
};

export type ApiResponse<TData> = {
  status: number;
  message: string;
  result: TData;
};

export const ApiResponse = <TData extends z.ZodType>(result: TData) =>
  z.object({
    status: z.number(),
    message: z.string(),
    result: result,
  });

export type CommonResponse<T> = {
  status: number;
  message: string;
  data: T;
};
