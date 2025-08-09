/**
 * SessionContext - Provides session state throughout the app
 * TODO: Should take dependencies as parameters for easier testing
 */

import { router } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { clearTokens, getTokensFromStorage, isTokenExpired } from '../session/TokenStore';

interface SessionData {
  isLoggedIn: boolean;
  isLoading: boolean;
  // Add more session data here as needed
  // user?: User;
  // permissions?: Permission[];
}

interface SessionContextType {
  session: SessionData;
  logout: () => void;
  refreshSessionState: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionContextProviderProps {
  children: ReactNode;
}

export const SessionContextProvider: React.FC<SessionContextProviderProps> = ({ children }) => {
  const [session, setSession] = useState<SessionData>({
    isLoggedIn: false,
    isLoading: true,
  });

  const checkSessionStatus = useCallback(async (): Promise<boolean> => {
    try {
      const tokens = await getTokensFromStorage();

      if (!tokens) {
        return false;
      }

      // Check if refresh token is expired
      if (isTokenExpired(tokens.refreshExpiresAt)) {
        await clearTokens();
        return false;
      }

      // If we have a valid refresh token, consider user logged in
      // The session interceptor will handle refreshing the access token as needed
      return true;
    } catch (error) {
      console.error('Error checking session status:', error);
      return false;
    }
  }, []);

  const refreshSessionState = useCallback(async () => {
    const isLoggedIn = await checkSessionStatus();
    setSession(prev => ({
      ...prev,
      isLoggedIn,
      isLoading: false,
    }));
  }, [checkSessionStatus]);

  const logout = useCallback(() => {
    // Clear tokens and update session state
    clearTokens()
      .then(() => {
        setSession({
          isLoggedIn: false,
          isLoading: false,
        });
        // Navigate to login screen
        router.replace('/login');
      })
      .catch(error => {
        console.error('Error during logout:', error);
        // Still update state even if clearing tokens fails
        setSession({
          isLoggedIn: false,
          isLoading: false,
        });
        router.replace('/login');
      });
  }, []);

  useEffect(() => {
    // Check session status on mount
    refreshSessionState();
  }, [refreshSessionState]);

  const contextValue: SessionContextType = {
    session,
    logout,
    refreshSessionState,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionContextProvider');
  }
  return context;
};
