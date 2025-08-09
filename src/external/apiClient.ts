/**
 * API Client configuration and factory
 * Creates and configures the main API client instance
 */

import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { OpenAPI } from './api/core/OpenAPI';

export const createApiClient = (): AxiosInstance => {
  // Configure the OpenAPI client
  OpenAPI.BASE = 'http://localhost:8086'; // This should come from environment config
  OpenAPI.WITH_CREDENTIALS = true;

  // Create an axios instance that matches the OpenAPI configuration
  const axiosInstance = axios.create({
    baseURL: OpenAPI.BASE,
    withCredentials: OpenAPI.WITH_CREDENTIALS,
  });

  return axiosInstance;
};

// Note: Authentication is now handled by the sessionInterceptor
// These functions are kept for backward compatibility but should be deprecated
export const setAuthToken = (token: string) => {
  OpenAPI.TOKEN = token;
};

export const clearAuthToken = () => {
  OpenAPI.TOKEN = undefined;
};
