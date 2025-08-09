/**
 * SessionInterceptor - Component that sets up axios request interceptor for authentication
 */

import { useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { sessionInterceptor } from '../session/sessionInterceptor';
import { getTokensFromStorage, saveTokensToStorage, refreshSession, clearTokens } from '../session/TokenStore';
import { useSessionContext } from './SessionContext';

interface SessionInterceptorProps {
  children: ReactNode;
}

export const SessionInterceptor: React.FC<SessionInterceptorProps> = ({ children }) => {
  const { logout } = useSessionContext();

  useEffect(() => {
    // Add request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        return await sessionInterceptor(config, {
          getTokensFromStorage,
          saveTokensToStorage,
          refreshSession,
          clearTokens,
          logout,
        });
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Cleanup function to remove interceptor
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [logout]);

  return <>{children}</>;
};
