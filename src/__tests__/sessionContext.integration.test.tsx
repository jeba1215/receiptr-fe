/**
 * Integration tests for SessionContext functionality with file-based routing
 */

import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { SessionContextProvider, useSessionContext } from '../context/SessionContext';
import * as TokenStore from '../session/TokenStore';

// Mock dependencies
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('../external/handlers/loginApiHandler', () => ({
  LoginApiHandler: jest.fn().mockImplementation(() => ({
    refreshSession: jest.fn(),
  })),
}));

// Test component that uses SessionContext
const TestSessionComponent = () => {
  const { session } = useSessionContext();
  
  return (
    <Text testID="session-status">
      {session.isLoading ? 'Loading' : session.isLoggedIn ? 'Logged In' : 'Not Logged In'}
    </Text>
  );
};

describe('SessionContext Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Session Initialization', () => {
    it('should initialize with no session when no tokens exist', async () => {
      // Mock no tokens in storage
      jest.spyOn(TokenStore, 'getTokensFromStorage').mockResolvedValue(null);

      const { getByTestId } = render(
        <SessionContextProvider>
          <TestSessionComponent />
        </SessionContextProvider>
      );

      await waitFor(() => {
        expect(getByTestId('session-status')).toHaveTextContent('Not Logged In');
      });
    });

    it('should initialize with session when valid tokens exist', async () => {
      // Mock valid tokens in storage
      const validTokens = {
        sessionToken: 'valid-session',
        refreshToken: 'valid-refresh',
        sessionExpiresAt: new Date(Date.now() + 3600000), // 1 hour from now
        refreshExpiresAt: new Date(Date.now() + 604800000), // 7 days from now
      };
      
      jest.spyOn(TokenStore, 'getTokensFromStorage').mockResolvedValue(validTokens);
      jest.spyOn(TokenStore, 'isTokenExpired').mockReturnValue(false);

      const { getByTestId } = render(
        <SessionContextProvider>
          <TestSessionComponent />
        </SessionContextProvider>
      );

      await waitFor(() => {
        expect(getByTestId('session-status')).toHaveTextContent('Logged In');
      });
    });

    it('should clear session when refresh token is expired', async () => {
      // Mock expired tokens
      const expiredTokens = {
        sessionToken: 'expired-session',
        refreshToken: 'expired-refresh',
        sessionExpiresAt: new Date(Date.now() - 3600000), // 1 hour ago
        refreshExpiresAt: new Date(Date.now() - 1800000), // 30 minutes ago
      };
      
      jest.spyOn(TokenStore, 'getTokensFromStorage').mockResolvedValue(expiredTokens);
      jest.spyOn(TokenStore, 'isTokenExpired').mockReturnValue(true);
      const mockClearTokens = jest.spyOn(TokenStore, 'clearTokens').mockResolvedValue();

      const { getByTestId } = render(
        <SessionContextProvider>
          <TestSessionComponent />
        </SessionContextProvider>
      );

      await waitFor(() => {
        expect(getByTestId('session-status')).toHaveTextContent('Not Logged In');
        expect(mockClearTokens).toHaveBeenCalled();
      });
    });
  });

  describe('Context Provider Functionality', () => {
    it('should provide context to child components', async () => {
      jest.spyOn(TokenStore, 'getTokensFromStorage').mockResolvedValue(null);

      const { getByTestId } = render(
        <SessionContextProvider>
          <TestSessionComponent />
        </SessionContextProvider>
      );

      await waitFor(() => {
        expect(getByTestId('session-status')).toBeTruthy();
      });
    });

    it('should handle token storage operations', async () => {
      const mockGetTokens = jest.spyOn(TokenStore, 'getTokensFromStorage').mockResolvedValue(null);

      render(
        <SessionContextProvider>
          <TestSessionComponent />
        </SessionContextProvider>
      );

      await waitFor(() => {
        expect(mockGetTokens).toHaveBeenCalled();
      });
    });
  });
});
