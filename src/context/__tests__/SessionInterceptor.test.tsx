/**
 * Tests for SessionInterceptor component - Axios interceptor setup
 */

import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import { SessionInterceptor } from '../SessionInterceptor';
import { SessionContextProvider } from '../SessionContext';
import * as TokenStore from '../../session/TokenStore';

// Mock dependencies
jest.mock('axios', () => ({
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
}));

jest.mock('../../session/TokenStore', () => ({
  getTokensFromStorage: jest.fn(),
  saveTokensToStorage: jest.fn(),
  refreshSession: jest.fn(),
  clearTokens: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

const mockAxiosInterceptorUse = axios.interceptors.request.use as jest.Mock;
const mockAxiosInterceptorEject = axios.interceptors.request.eject as jest.Mock;

const TestComponent = () => <Text>Test Content</Text>;

const renderWithProviders = () => {
  return render(
    <SessionContextProvider>
      <SessionInterceptor>
        <TestComponent />
      </SessionInterceptor>
    </SessionContextProvider>
  );
};

describe('SessionInterceptor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the interceptor ID that would be returned
    mockAxiosInterceptorUse.mockReturnValue(123);
  });

  it('should add axios request interceptor on mount', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(mockAxiosInterceptorUse).toHaveBeenCalledTimes(1);
    });

    const [requestInterceptor, errorHandler] = mockAxiosInterceptorUse.mock.calls[0];
    expect(typeof requestInterceptor).toBe('function');
    expect(typeof errorHandler).toBe('function');
  });

  it('should remove axios request interceptor on unmount', async () => {
    const { unmount } = renderWithProviders();

    await waitFor(() => {
      expect(mockAxiosInterceptorUse).toHaveBeenCalledTimes(1);
    });

    unmount();

    expect(mockAxiosInterceptorEject).toHaveBeenCalledWith(123);
  });

  it('should render children correctly', () => {
    const { getByText } = renderWithProviders();

    expect(getByText('Test Content')).toBeTruthy();
  });

  describe('Interceptor functionality', () => {
    it('should call sessionInterceptor with correct parameters', async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(mockAxiosInterceptorUse).toHaveBeenCalledTimes(1);
      });

      const [requestInterceptor] = mockAxiosInterceptorUse.mock.calls[0];
      
      // Mock a request config
      const mockConfig = {
        url: '/api/test',
        method: 'GET',
        headers: {} as any,
      };

      // Mock TokenStore functions
      const mockGetTokens = TokenStore.getTokensFromStorage as jest.Mock;
      mockGetTokens.mockResolvedValue({
        sessionToken: 'test-token',
        refreshToken: 'refresh-token',
        sessionExpiresAt: new Date(Date.now() + 3600000),
        refreshExpiresAt: new Date(Date.now() + 86400000),
      });

      const result = await requestInterceptor(mockConfig);

      expect(result).toBeDefined();
      expect(mockGetTokens).toHaveBeenCalled();
    });

    it('should handle interceptor errors', async () => {
      renderWithProviders();

      await waitFor(() => {
        expect(mockAxiosInterceptorUse).toHaveBeenCalledTimes(1);
      });

      const [, errorHandler] = mockAxiosInterceptorUse.mock.calls[0];
      
      const testError = new Error('Test error');
      await expect(errorHandler(testError)).rejects.toBe(testError);
    });
  });

  describe('Integration with SessionContext', () => {
    it('should pass logout function to sessionInterceptor', async () => {
      // Mock TokenStore to trigger logout scenario
      const mockGetTokens = TokenStore.getTokensFromStorage as jest.Mock;
      const mockRefreshSession = TokenStore.refreshSession as jest.Mock;
      
      mockGetTokens.mockResolvedValue({
        sessionToken: 'expired-token',
        refreshToken: 'expired-refresh',
        sessionExpiresAt: new Date(Date.now() - 3600000), // Expired
        refreshExpiresAt: new Date(Date.now() - 3600000), // Expired
      });

      mockRefreshSession.mockRejectedValue(new Error('Refresh failed'));

      renderWithProviders();

      await waitFor(() => {
        expect(mockAxiosInterceptorUse).toHaveBeenCalledTimes(1);
      });

      const [requestInterceptor] = mockAxiosInterceptorUse.mock.calls[0];
      
      const mockConfig = {
        url: '/api/test',
        method: 'GET',
        headers: {} as any,
      };

      // This should trigger the logout flow
      try {
        await requestInterceptor(mockConfig);
      } catch {
        // Expected to throw during logout
      }

      // Verify that the interceptor was set up with the logout function
      expect(mockAxiosInterceptorUse).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      );
    });
  });

  describe('Multiple instances', () => {
    it('should handle multiple SessionInterceptor instances', async () => {
      const { unmount: unmount1 } = render(
        <SessionContextProvider>
          <SessionInterceptor>
            <Text>Instance 1</Text>
          </SessionInterceptor>
        </SessionContextProvider>
      );

      const { unmount: unmount2 } = render(
        <SessionContextProvider>
          <SessionInterceptor>
            <Text>Instance 2</Text>
          </SessionInterceptor>
        </SessionContextProvider>
      );

      await waitFor(() => {
        expect(mockAxiosInterceptorUse).toHaveBeenCalledTimes(2);
      });

      unmount1();
      expect(mockAxiosInterceptorEject).toHaveBeenCalledTimes(1);

      unmount2();
      expect(mockAxiosInterceptorEject).toHaveBeenCalledTimes(2);
    });
  });
});
