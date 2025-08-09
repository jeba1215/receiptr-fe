/**
 * TokenStore - Secure storage for authentication tokens using Expo SecureStore
 * Falls back to localStorage on web platforms
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { LoginApiHandler } from '../external/handlers/loginApiHandler';
import type { LoginResult } from '../models/LoginResult';

const SESSION_TOKEN_KEY = 'receiptr_session_token';
const REFRESH_TOKEN_KEY = 'receiptr_refresh_token';
const SESSION_EXPIRES_KEY = 'receiptr_session_expires';
const REFRESH_EXPIRES_KEY = 'receiptr_refresh_expires';

// Platform-specific storage helpers
// Uses SecureStore on native platforms (iOS/Android) for secure storage
// Falls back to localStorage on web platforms since SecureStore is not available
const isWeb = Platform.OS === 'web';

const getItem = async (key: string): Promise<string | null> => {
  if (isWeb) {
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
};

const setItem = async (key: string, value: string): Promise<void> => {
  if (isWeb) {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const deleteItem = async (key: string): Promise<void> => {
  if (isWeb) {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export interface TokenData {
  sessionToken: string;
  refreshToken: string;
  sessionExpiresAt: Date;
  refreshExpiresAt: Date;
}

export const getTokensFromStorage = async (): Promise<TokenData | null> => {
  try {
    const sessionToken = await getItem(SESSION_TOKEN_KEY);
    const refreshToken = await getItem(REFRESH_TOKEN_KEY);
    const sessionExpiresStr = await getItem(SESSION_EXPIRES_KEY);
    const refreshExpiresStr = await getItem(REFRESH_EXPIRES_KEY);

    if (!sessionToken || !refreshToken || !sessionExpiresStr || !refreshExpiresStr) {
      return null;
    }

    const sessionExpiresAt = new Date(sessionExpiresStr);
    const refreshExpiresAt = new Date(refreshExpiresStr);

    if (isNaN(sessionExpiresAt.getTime()) || isNaN(refreshExpiresAt.getTime())) {
      return null;
    }

    return {
      sessionToken,
      refreshToken,
      sessionExpiresAt,
      refreshExpiresAt,
    };
  } catch (error) {
    console.error('Failed to get tokens from storage:', error);
    return null;
  }
};

export const saveTokensToStorage = async (loginResult: LoginResult): Promise<void> => {
  try {
    await Promise.all([
      setItem(SESSION_TOKEN_KEY, loginResult.sessionToken),
      setItem(REFRESH_TOKEN_KEY, loginResult.refreshToken),
      setItem(SESSION_EXPIRES_KEY, loginResult.sessionExpiresAt.toISOString()),
      setItem(REFRESH_EXPIRES_KEY, loginResult.refreshExpiresAt.toISOString()),
    ]);
  } catch (error) {
    console.error('Failed to save tokens to storage:', error);
    throw error;
  }
};

export const clearTokens = async (): Promise<void> => {
  try {
    await Promise.all([
      deleteItem(SESSION_TOKEN_KEY),
      deleteItem(REFRESH_TOKEN_KEY),
      deleteItem(SESSION_EXPIRES_KEY),
      deleteItem(REFRESH_EXPIRES_KEY),
    ]);
  } catch (error) {
    console.error('Failed to clear tokens from storage:', error);
    throw error;
  }
};

export const isTokenExpired = (expiresAt: Date, bufferMinutes = 1): boolean => {
  const bufferTime = bufferMinutes * 60 * 1000; // Convert minutes to milliseconds
  return Date.now() > (expiresAt.getTime() - bufferTime);
};

export const refreshSession = async (): Promise<LoginResult> => {
  const loginHandler = new LoginApiHandler();
  
  const tokens = await getTokensFromStorage();
  if (!tokens) {
    throw new Error('No refresh token available');
  }

  const refreshResult = await loginHandler.refreshSession({
    refreshToken: tokens.refreshToken,
  });

  return refreshResult;
};
