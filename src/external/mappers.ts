/**
 * Mappers to convert from API DTOs to internal domain models
 * These functions ensure type safety and ownership of internal data types
 */

import type { AuthTokens } from '../models/Auth';
import type { Receipt } from '../models/Receipt';
import type { User } from '../models/User';
import type { LoginResponse as LoginResponseDto } from './api/models/LoginResponse';
import type { ReceiptResponse as ReceiptDto } from './api/models/ReceiptResponse';
import type { User as UserDto } from './api/models/User';

// Re-export login mapper
export { mapLoginDtoToLoginResult } from './mappers/mapLoginDtoToLoginResult';

/**
 * Maps UserDto to internal User model
 */
export const mapUserDtoToUser = (userDto: UserDto): User => {
  if (!userDto.id?.value || !userDto.email || !userDto.createdAt || !userDto.createdBy?.value || !userDto.lastEditedAt || !userDto.lastEditedBy?.value) {
    throw new Error('Invalid UserDto: missing required fields');
  }

  return {
    id: userDto.id.value,
    email: userDto.email,
    createdAt: new Date(userDto.createdAt),
    createdBy: userDto.createdBy.value,
    lastEditedAt: new Date(userDto.lastEditedAt),
    lastEditedBy: userDto.lastEditedBy.value,
  };
};

/**
 * Maps ReceiptDto to internal Receipt model
 */
export const mapReceiptDtoToReceipt = (receiptDto: ReceiptDto): Receipt => {
  if (receiptDto.id === undefined || !receiptDto.description || receiptDto.amount === undefined || !receiptDto.createdAt) {
    throw new Error('Invalid ReceiptDto: missing required fields');
  }

  return {
    id: receiptDto.id,
    description: receiptDto.description,
    amount: receiptDto.amount,
    createdAt: new Date(receiptDto.createdAt),
  };
};

/**
 * Maps LoginResponseDto to internal AuthTokens model
 */
export const mapLoginResponseDtoToAuthTokens = (loginResponseDto: LoginResponseDto): AuthTokens => {
  if (!loginResponseDto.sessionToken?.token || !loginResponseDto.sessionToken?.expiresAt ||
    !loginResponseDto.refreshToken?.token || !loginResponseDto.refreshToken?.expiresAt) {
    throw new Error('Invalid LoginResponseDto: missing required token fields');
  }

  return {
    sessionToken: loginResponseDto.sessionToken.token,
    refreshToken: loginResponseDto.refreshToken.token,
    sessionExpiresAt: new Date(loginResponseDto.sessionToken.expiresAt),
    refreshExpiresAt: new Date(loginResponseDto.refreshToken.expiresAt),
  };
};
