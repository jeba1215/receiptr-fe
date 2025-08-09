/**
 * LoginApiHandler - Handles authentication-related API calls
 * This class encapsulates all login/auth related API operations and mapping
 */

import type { AuthTokens, CreateUserData, RefreshTokenData } from '../../models/Auth';
import type { LoginCredentials, LoginResult, RefreshTokenRequest } from '../../models/LoginResult';
import { CreateUserCommand, LoginCommand, PrivateAuthenticationService, PublicAuthenticationService } from '../api';
import { mapLoginResponseDtoToAuthTokens } from '../mappers';
import { mapLoginDtoToLoginResult } from '../mappers/mapLoginDtoToLoginResult';

export class LoginApiHandler {
  /**
   * Authenticates a user with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    const loginCommand: LoginCommand = {
      authMethod: LoginCommand.authMethod.EMAIL_PASSWORD,
      email: credentials.email,
      password: credentials.password,
    };

    const response = await PublicAuthenticationService.login(loginCommand);
    return mapLoginDtoToLoginResult(response);
  }

  /**
   * Refreshes authentication tokens using refresh token
   */
  async refreshSession(refreshTokenRequest: RefreshTokenRequest): Promise<LoginResult> {
    const refreshRequest = {
      refreshToken: refreshTokenRequest.refreshToken,
      deviceInfo: refreshTokenRequest.deviceInfo,
    };

    const response = await PublicAuthenticationService.refresh(refreshRequest);
    return mapLoginDtoToLoginResult(response);
  }

  /**
   * Creates a new user account and returns auth tokens
   */
  async createUser(userData: CreateUserData): Promise<AuthTokens> {
    const createUserCommand: CreateUserCommand = {
      authMethod: CreateUserCommand.authMethod.EMAIL_PASSWORD,
      email: userData.email,
      password: userData.password,
    };

    const response = await PublicAuthenticationService.createUser(createUserCommand);
    return mapLoginResponseDtoToAuthTokens(response);
  }

  /**
   * Refreshes authentication tokens (legacy method for backwards compatibility)
   */
  async refreshTokens(refreshData: RefreshTokenData): Promise<AuthTokens> {
    const refreshRequest = {
      refreshToken: refreshData.refreshToken,
      deviceInfo: refreshData.deviceInfo,
    };

    const response = await PublicAuthenticationService.refresh(refreshRequest);
    return mapLoginResponseDtoToAuthTokens(response);
  }

  /**
   * Logs out the current user
   */
  async logout(): Promise<void> {
    await PrivateAuthenticationService.logout();
  }

  /**
   * Health check for authentication service
   */
  async healthCheck(): Promise<string> {
    return await PublicAuthenticationService.health();
  }
}
