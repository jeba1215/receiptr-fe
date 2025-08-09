/**
 * Internal Authentication domain models
 * These are the application's internal representations for auth-related data
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserData {
  email: string;
  password: string;
}

export interface AuthTokens {
  sessionToken: string;
  refreshToken: string;
  sessionExpiresAt: Date;
  refreshExpiresAt: Date;
}

export interface RefreshTokenData {
  refreshToken: string;
  deviceInfo?: string;
}
