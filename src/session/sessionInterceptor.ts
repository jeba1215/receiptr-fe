/**
 * Session interceptor for handling authentication in API requests
 */

import type { InternalAxiosRequestConfig } from 'axios';
import type { LoginResult } from '../models/LoginResult';
import type { TokenData } from './TokenStore';

// Global promise to track refresh state
let isRefreshing: Promise<void> | null = null;

interface SessionInterceptorParams {
  getTokensFromStorage: () => Promise<TokenData | null>;
  saveTokensToStorage: (loginResult: LoginResult) => Promise<void>;
  refreshSession: () => Promise<LoginResult>;
  clearTokens: () => Promise<void>;
  logout: () => void;
}

export const sessionInterceptor = async (
  axiosRequest: InternalAxiosRequestConfig,
  {
    getTokensFromStorage,
    saveTokensToStorage,
    refreshSession,
    clearTokens,
    logout,
  }: SessionInterceptorParams
): Promise<InternalAxiosRequestConfig> => {
  // Skip auth for login and refresh endpoints
  if (isAuthEndpoint(axiosRequest.url)) {
    return axiosRequest;
  }

  // If already refreshing, wait for it to complete
  if (isRefreshing) {
    await isRefreshing;
  }

  // Get tokens from storage
  let tokens = await getTokensFromStorage();

  // Check if session is expired or close to expiring
  if (tokens && isTokenExpiredOrNearExpiry(tokens.sessionExpiresAt)) {
    // Check if refresh token is still valid
    if (isTokenExpiredOrNearExpiry(tokens.refreshExpiresAt)) {
      // Refresh token is also expired, logout
      await clearTokens();
      logout();
      throw new Error('Session expired, please login again');
    }

    // If not already refreshing, start the refresh process
    if (!isRefreshing) {
      isRefreshing = performTokenRefresh({
        refreshSession,
        saveTokensToStorage,
        clearTokens,
        logout,
      });
    }

    // Wait for refresh to complete
    await isRefreshing;

    // Get updated tokens after refresh
    tokens = await getTokensFromStorage();
  }


  // At this point, session should be valid
  if (tokens?.sessionToken) {
    axiosRequest.headers.Authorization = `Bearer ${tokens.sessionToken}`;
  }

  return axiosRequest;
};

const performTokenRefresh = async ({
  refreshSession,
  saveTokensToStorage,
  clearTokens,
  logout,
}: Omit<SessionInterceptorParams, 'getTokensFromStorage'>): Promise<void> => {
  try {
    const newTokens = await refreshSession();
    await saveTokensToStorage(newTokens);
  } catch (error) {
    console.error('Token refresh failed:', error);
    await clearTokens();
    logout();
    throw error;
  } finally {
    // Reset the refreshing state
    isRefreshing = null;
  }
};

const isAuthEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return url.includes('/login') || url.includes('/refresh') || url.includes('/auth');
};

const isTokenExpiredOrNearExpiry = (expiresAt?: Date, bufferMinutes = 1): boolean => {
  if (!expiresAt) return true;

  const expiresAtTime = expiresAt.getTime();
  if (isNaN(expiresAtTime)) return true;

  const bufferTime = bufferMinutes * 60 * 1000; // Convert minutes to milliseconds
  return Date.now() > (expiresAtTime - bufferTime);
};
