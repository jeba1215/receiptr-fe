/**
 * Tests for SessionContext - Session state management
 */

import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { SessionContextProvider, useSessionContext } from '../SessionContext';
import * as TokenStore from '../../session/TokenStore';

// Mock dependencies
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock('../../session/TokenStore', () => ({
  getTokensFromStorage: jest.fn(),
  clearTokens: jest.fn(),
  isTokenExpired: jest.fn(),
}));

const mockGetTokensFromStorage = TokenStore.getTokensFromStorage as jest.Mock;
const mockClearTokens = TokenStore.clearTokens as jest.Mock;
const mockIsTokenExpired = TokenStore.isTokenExpired as jest.Mock;
const mockRouterReplace = router.replace as jest.Mock;

// Test component to access context
const TestComponent: React.FC<{ onSessionChange?: (session: any) => void }> = ({ onSessionChange }) => {
  const { session, logout, refreshSessionState } = useSessionContext();
  
  React.useEffect(() => {
    if (onSessionChange) {
      onSessionChange({ session, logout, refreshSessionState });
    }
  }, [session, logout, refreshSessionState, onSessionChange]);

  return (
    <React.Fragment>
      <Text testID="isLoggedIn">{session.isLoggedIn.toString()}</Text>
    </React.Fragment>
  );
};

const renderWithProvider = (onSessionChange?: (session: any) => void) => {
  return render(
    <SessionContextProvider>
      <TestComponent onSessionChange={onSessionChange} />
    </SessionContextProvider>
  );
};

describe('SessionContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('SessionContextProvider', () => {
    it('should provide initial session state as not logged in', async () => {
      mockGetTokensFromStorage.mockResolvedValue(null);

      const { getByTestId } = renderWithProvider();

      await waitFor(() => {
        expect(getByTestId('isLoggedIn')).toHaveTextContent('false');
      });

      expect(mockGetTokensFromStorage).toHaveBeenCalledTimes(1);
    });

    it('should set isLoggedIn to true when valid tokens exist', async () => {
      const validTokens = {
        sessionToken: 'valid-session',
        refreshToken: 'valid-refresh',
        sessionExpiresAt: new Date(Date.now() + 3600000),
        refreshExpiresAt: new Date(Date.now() + 86400000),
      };

      mockGetTokensFromStorage.mockResolvedValue(validTokens);
      mockIsTokenExpired.mockReturnValue(false);

      const { getByTestId } = renderWithProvider();

      await waitFor(() => {
        expect(getByTestId('isLoggedIn')).toHaveTextContent('true');
      });

      expect(mockGetTokensFromStorage).toHaveBeenCalledTimes(1);
      expect(mockIsTokenExpired).toHaveBeenCalledWith(validTokens.refreshExpiresAt);
    });

    it('should logout when refresh token is expired', async () => {
      const expiredTokens = {
        sessionToken: 'session',
        refreshToken: 'refresh',
        sessionExpiresAt: new Date(Date.now() + 3600000),
        refreshExpiresAt: new Date(Date.now() - 3600000), // Expired
      };

      mockGetTokensFromStorage.mockResolvedValue(expiredTokens);
      mockIsTokenExpired.mockReturnValue(true);

      const { getByTestId } = renderWithProvider();

      await waitFor(() => {
        expect(getByTestId('isLoggedIn')).toHaveTextContent('false');
      });

      expect(mockClearTokens).toHaveBeenCalledTimes(1);
    });

    it('should handle storage errors gracefully', async () => {
      mockGetTokensFromStorage.mockRejectedValue(new Error('Storage error'));

      const { getByTestId } = renderWithProvider();

      await waitFor(() => {
        expect(getByTestId('isLoggedIn')).toHaveTextContent('false');
      });
    });
  });

  describe('logout function', () => {
    it('should clear tokens and navigate to login', async () => {
      const validTokens = {
        sessionToken: 'valid-session',
        refreshToken: 'valid-refresh',
        sessionExpiresAt: new Date(Date.now() + 3600000),
        refreshExpiresAt: new Date(Date.now() + 86400000),
      };

      mockGetTokensFromStorage.mockResolvedValue(validTokens);
      mockIsTokenExpired.mockReturnValue(false);
      mockClearTokens.mockResolvedValue(undefined);

      let sessionData: any;
      const { getByTestId } = renderWithProvider((data) => {
        sessionData = data;
      });

      // Wait for initial load
      await waitFor(() => {
        expect(getByTestId('isLoggedIn')).toHaveTextContent('true');
      });

      // Call logout
      await sessionData.logout();

      await waitFor(() => {
        expect(getByTestId('isLoggedIn')).toHaveTextContent('false');
      });

      expect(mockClearTokens).toHaveBeenCalledTimes(1);
      expect(mockRouterReplace).toHaveBeenCalledWith('/login');
    });

    it('should handle logout errors gracefully', async () => {
      const validTokens = {
        sessionToken: 'valid-session',
        refreshToken: 'valid-refresh',
        sessionExpiresAt: new Date(Date.now() + 3600000),
        refreshExpiresAt: new Date(Date.now() + 86400000),
      };

      mockGetTokensFromStorage.mockResolvedValue(validTokens);
      mockIsTokenExpired.mockReturnValue(false);
      mockClearTokens.mockRejectedValue(new Error('Clear failed'));

      let sessionData: any;
      const { getByTestId } = renderWithProvider((data) => {
        sessionData = data;
      });

      // Wait for initial load
      await waitFor(() => {
        expect(getByTestId('isLoggedIn')).toHaveTextContent('true');
      });

      // Call logout
      await sessionData.logout();

      // Should still update state and navigate even if clearing tokens fails
      await waitFor(() => {
        expect(getByTestId('isLoggedIn')).toHaveTextContent('false');
      });

      expect(mockRouterReplace).toHaveBeenCalledWith('/login');
    });
  });

  describe('refreshSessionState function', () => {
    it('should update session state when called', async () => {
      mockGetTokensFromStorage
        .mockResolvedValueOnce(null) // Initial load
        .mockResolvedValueOnce({ // After refresh
          sessionToken: 'new-session',
          refreshToken: 'new-refresh',
          sessionExpiresAt: new Date(Date.now() + 3600000),
          refreshExpiresAt: new Date(Date.now() + 86400000),
        });
      
      mockIsTokenExpired.mockReturnValue(false);

      let sessionData: any;
      const { getByTestId } = renderWithProvider((data) => {
        sessionData = data;
      });

      // Wait for initial load (not logged in)
      await waitFor(() => {
        expect(getByTestId('isLoggedIn')).toHaveTextContent('false');
      });

      // Call refreshSessionState
      await sessionData.refreshSessionState();

      // Should now be logged in
      await waitFor(() => {
        expect(getByTestId('isLoggedIn')).toHaveTextContent('true');
      });

      expect(mockGetTokensFromStorage).toHaveBeenCalledTimes(2);
    });
  });

  describe('Context usage', () => {
    it('should throw error when used outside provider', () => {
      // Mock console.error to prevent test output noise
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useSessionContext must be used within a SessionContextProvider');

      consoleSpy.mockRestore();
    });
  });
});
