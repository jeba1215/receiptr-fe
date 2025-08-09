/**
 * Login response mapper
 * Maps from API DTOs to internal login domain models
 */

import type { LoginResult } from '../../models/LoginResult';
import type { LoginResponse as LoginResponseDto } from '../api';

/**
 * Maps LoginResponseDto to internal LoginResult model
 */
export const mapLoginDtoToLoginResult = (loginResponseDto: LoginResponseDto): LoginResult => {
  if (!loginResponseDto.sessionToken?.token || !loginResponseDto.sessionToken?.expiresAt ||
    !loginResponseDto.refreshToken?.token || !loginResponseDto.refreshToken?.expiresAt) {
    throw new Error('Invalid LoginResponseDto: missing required token fields');
  }

  return {
    sessionToken: loginResponseDto.sessionToken.token,
    refreshToken: loginResponseDto.refreshToken.token,
    sessionExpiresAt: parseUtcDate(loginResponseDto.sessionToken.expiresAt),
    refreshExpiresAt: parseUtcDate(loginResponseDto.refreshToken.expiresAt),
  };
};

/**
 * Safely parse a date string as UTC, regardless of format
 * Handles timezone issues by ensuring all dates are interpreted as UTC
 */
const parseUtcDate = (dateString: string): Date => {
  // If the string already has timezone info (ends with Z or has +/-offset), use it as-is
  if (dateString.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateString)) {
    return new Date(dateString);
  }
  
  // If no timezone info, explicitly treat as UTC by appending 'Z'
  return new Date(dateString + 'Z');
};
