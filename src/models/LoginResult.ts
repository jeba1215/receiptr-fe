/**
 * Login domain models
 * Internal types for authentication and login flow
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  sessionToken: string;
  refreshToken: string;
  sessionExpiresAt: Date;
  refreshExpiresAt: Date;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  deviceInfo?: string;
}

export interface LoginError {
  message: string;
  code?: string;
}
