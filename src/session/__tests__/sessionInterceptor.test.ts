/**
 * Tests for sessionInterceptor - Request queuing and token refresh logic
 */

import type { InternalAxiosRequestConfig } from 'axios';
import { sessionInterceptor } from '../sessionInterceptor';
import type { LoginResult } from '../../models/LoginResult';
import type { TokenData } from '../TokenStore';

// Mock dependencies
const mockGetTokensFromStorage = jest.fn();
const mockSaveTokensToStorage = jest.fn();
const mockRefreshSession = jest.fn();
const mockClearTokens = jest.fn();
const mockLogout = jest.fn();

const createMockRequest = (url = '/api/data'): InternalAxiosRequestConfig => ({
  url,
  method: 'GET',
  headers: {} as any,
  baseURL: 'http://localhost:8086',
});

const createMockTokenData = (
  sessionExpiresAt = new Date(Date.now() + 60000), // 1 minute from now
  refreshExpiresAt = new Date(Date.now() + 86400000) // 24 hours from now
): TokenData => ({
  sessionToken: 'valid-session-token',
  refreshToken: 'valid-refresh-token',
  sessionExpiresAt,
  refreshExpiresAt,
});

const createMockLoginResult = (): LoginResult => ({
  sessionToken: 'new-session-token',
  refreshToken: 'new-refresh-token',
  sessionExpiresAt: new Date(Date.now() + 3600000), // 1 hour from now
  refreshExpiresAt: new Date(Date.now() + 86400000), // 24 hours from now
});

describe('sessionInterceptor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the global isRefreshing state by mocking the module
    jest.resetModules();
  });

  const defaultParams = {
    getTokensFromStorage: mockGetTokensFromStorage,
    saveTokensToStorage: mockSaveTokensToStorage,
    refreshSession: mockRefreshSession,
    clearTokens: mockClearTokens,
    logout: mockLogout,
  };

  describe('Auth endpoint handling', () => {
    it('should skip auth for login endpoints', async () => {
      const request = createMockRequest('/api/login');
      
      const result = await sessionInterceptor(request, defaultParams);

      expect(result).toBe(request);
      expect(mockGetTokensFromStorage).not.toHaveBeenCalled();
      expect(request.headers.Authorization).toBeUndefined();
    });

    it('should skip auth for refresh endpoints', async () => {
      const request = createMockRequest('/api/refresh');
      
      const result = await sessionInterceptor(request, defaultParams);

      expect(result).toBe(request);
      expect(mockGetTokensFromStorage).not.toHaveBeenCalled();
      expect(request.headers.Authorization).toBeUndefined();
    });

    it('should skip auth for auth endpoints', async () => {
      const request = createMockRequest('/api/auth/verify');
      
      const result = await sessionInterceptor(request, defaultParams);

      expect(result).toBe(request);
      expect(mockGetTokensFromStorage).not.toHaveBeenCalled();
      expect(request.headers.Authorization).toBeUndefined();
    });
  });

  describe('Valid token handling', () => {
    it('should add Authorization header for valid tokens', async () => {
      const request = createMockRequest('/api/data');
      // Create a token that expires well beyond the buffer time (5 minutes from now)
      const validTokens = createMockTokenData(
        new Date(Date.now() + 5 * 60000), // 5 minutes from now
        new Date(Date.now() + 86400000)   // 24 hours from now
      );
      
      mockGetTokensFromStorage.mockResolvedValue(validTokens);

      const result = await sessionInterceptor(request, defaultParams);

      expect(mockGetTokensFromStorage).toHaveBeenCalledTimes(1);
      expect(result.headers.Authorization).toBe('Bearer valid-session-token');
      expect(mockRefreshSession).not.toHaveBeenCalled();
    });

    it('should handle missing tokens gracefully', async () => {
      const request = createMockRequest('/api/data');
      
      mockGetTokensFromStorage.mockResolvedValue(null);

      const result = await sessionInterceptor(request, defaultParams);

      expect(mockGetTokensFromStorage).toHaveBeenCalledTimes(1);
      expect(result.headers.Authorization).toBeUndefined();
      expect(mockRefreshSession).not.toHaveBeenCalled();
    });
  });

  describe('Token expiration and refresh', () => {
    it('should refresh expired session tokens', async () => {
      const request = createMockRequest('/api/data');
      const expiredTokens = createMockTokenData(
        new Date(Date.now() - 60000), // Expired 1 minute ago
        new Date(Date.now() + 86400000) // Refresh token still valid
      );
      const newTokens = createMockTokenData();
      const loginResult = createMockLoginResult();
      
      mockGetTokensFromStorage
        .mockResolvedValueOnce(expiredTokens) // First call - expired tokens
        .mockResolvedValueOnce(newTokens); // Second call - after refresh
      
      mockRefreshSession.mockResolvedValue(loginResult);

      const result = await sessionInterceptor(request, defaultParams);

      expect(mockGetTokensFromStorage).toHaveBeenCalledTimes(2);
      expect(mockRefreshSession).toHaveBeenCalledTimes(1);
      expect(mockSaveTokensToStorage).toHaveBeenCalledWith(loginResult);
      expect(result.headers.Authorization).toBe('Bearer valid-session-token');
    });

    it('should logout when refresh token is expired', async () => {
      const request = createMockRequest('/api/data');
      const expiredTokens = createMockTokenData(
        new Date(Date.now() - 60000), // Session token expired
        new Date(Date.now() - 3600000) // Refresh token also expired
      );
      
      mockGetTokensFromStorage.mockResolvedValue(expiredTokens);

      await expect(sessionInterceptor(request, defaultParams)).rejects.toThrow(
        'Session expired, please login again'
      );

      expect(mockClearTokens).toHaveBeenCalledTimes(1);
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockRefreshSession).not.toHaveBeenCalled();
    });

    it('should handle refresh failure by logging out', async () => {
      const request = createMockRequest('/api/data');
      const expiredTokens = createMockTokenData(
        new Date(Date.now() - 60000), // Expired 1 minute ago
        new Date(Date.now() + 86400000) // Refresh token still valid
      );
      
      mockGetTokensFromStorage.mockResolvedValue(expiredTokens);
      mockRefreshSession.mockRejectedValue(new Error('Refresh failed'));

      await expect(sessionInterceptor(request, defaultParams)).rejects.toThrow(
        'Refresh failed'
      );

      expect(mockRefreshSession).toHaveBeenCalledTimes(1);
      expect(mockClearTokens).toHaveBeenCalledTimes(1);
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Request queuing during refresh', () => {
    it('should queue multiple requests during refresh', async () => {
      // Use the imported interceptor to access the global isRefreshing state
      const interceptor = sessionInterceptor;
      
      const request1 = createMockRequest('/api/data1');
      const request2 = createMockRequest('/api/data2');
      const request3 = createMockRequest('/api/data3');
      
      const expiredTokens = createMockTokenData(
        new Date(Date.now() - 60000), // Expired
        new Date(Date.now() + 86400000) // Refresh token valid
      );
      const newTokens = createMockTokenData();
      const loginResult = createMockLoginResult();
      
      mockGetTokensFromStorage.mockResolvedValue(expiredTokens);
      mockRefreshSession.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(loginResult), 100))
      );

      // Start all requests simultaneously
      const promises = [
        interceptor(request1, defaultParams),
        interceptor(request2, defaultParams),
        interceptor(request3, defaultParams),
      ];

      // After refresh completes, mock should return new tokens
      mockGetTokensFromStorage.mockResolvedValue(newTokens);

      const results = await Promise.all(promises);

      // Refresh should only be called once despite multiple requests
      expect(mockRefreshSession).toHaveBeenCalledTimes(1);
      expect(mockSaveTokensToStorage).toHaveBeenCalledTimes(1);
      expect(mockSaveTokensToStorage).toHaveBeenCalledWith(loginResult);

      // All requests should have the new token
      results.forEach(result => {
        expect(result.headers.Authorization).toBe('Bearer valid-session-token');
      });
    });

    it('should handle concurrent requests with refresh failure', async () => {
      const interceptor = sessionInterceptor;
      
      const request1 = createMockRequest('/api/data1');
      const request2 = createMockRequest('/api/data2');
      
      const expiredTokens = createMockTokenData(
        new Date(Date.now() - 60000), // Expired
        new Date(Date.now() + 86400000) // Refresh token valid
      );
      
      mockGetTokensFromStorage.mockResolvedValue(expiredTokens);
      mockRefreshSession.mockImplementation(() => 
        new Promise((_, reject) => setTimeout(() => reject(new Error('Refresh failed')), 100))
      );

      const promises = [
        interceptor(request1, defaultParams),
        interceptor(request2, defaultParams),
      ];

      await expect(Promise.all(promises)).rejects.toThrow('Refresh failed');

      // Refresh should only be called once
      expect(mockRefreshSession).toHaveBeenCalledTimes(1);
      expect(mockClearTokens).toHaveBeenCalledTimes(1);
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Near-expiry token refresh', () => {
    it('should refresh tokens that are close to expiring', async () => {
      const request = createMockRequest('/api/data');
      const nearExpiryTokens = createMockTokenData(
        new Date(Date.now() + 30000), // Expires in 30 seconds (within 1 minute buffer)
        new Date(Date.now() + 86400000) // Refresh token still valid
      );
      const newTokens = createMockTokenData();
      const loginResult = createMockLoginResult();
      
      mockGetTokensFromStorage
        .mockResolvedValueOnce(nearExpiryTokens)
        .mockResolvedValueOnce(newTokens);
      
      mockRefreshSession.mockResolvedValue(loginResult);

      const result = await sessionInterceptor(request, defaultParams);

      expect(mockRefreshSession).toHaveBeenCalledTimes(1);
      expect(mockSaveTokensToStorage).toHaveBeenCalledWith(loginResult);
      expect(result.headers.Authorization).toBe('Bearer valid-session-token');
    });
  });

  describe('Error handling', () => {
    it('should handle storage errors gracefully', async () => {
      const request = createMockRequest('/api/data');
      
      mockGetTokensFromStorage.mockRejectedValue(new Error('Storage error'));

      await expect(sessionInterceptor(request, defaultParams)).rejects.toThrow('Storage error');
    });

    it('should handle save token errors during refresh', async () => {
      const request = createMockRequest('/api/data');
      const expiredTokens = createMockTokenData(
        new Date(Date.now() - 60000), // Expired
        new Date(Date.now() + 86400000) // Refresh token valid
      );
      const loginResult = createMockLoginResult();
      
      mockGetTokensFromStorage.mockResolvedValue(expiredTokens);
      mockRefreshSession.mockResolvedValue(loginResult);
      mockSaveTokensToStorage.mockRejectedValue(new Error('Save failed'));

      await expect(sessionInterceptor(request, defaultParams)).rejects.toThrow('Save failed');

      expect(mockRefreshSession).toHaveBeenCalledTimes(1);
      expect(mockClearTokens).toHaveBeenCalledTimes(1);
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });
});
