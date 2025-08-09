/**
 * Login root component that handles dependency injection
 * Connects LoginScreen with API handlers and session management
 * Note: This component is deprecated. Use the direct LoginScreen in login.tsx instead.
 */

import React from 'react';
import type { LoginApiHandler } from '../../src/external/handlers/loginApiHandler';
import { LoginScreen } from './LoginScreen';

export interface LoginRootProps {
  loginHandler: LoginApiHandler;
  onLoginSuccess: () => void;
  onNavigateToRegister?: () => void;
}

export const LoginRoot: React.FC<LoginRootProps> = (props) => {
  return <LoginScreen {...props} sessionStorage={{ setTokens: async () => {} }} />;
};
