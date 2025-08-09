/**
 * Tests for mapLoginDtoToLoginResult timezone handling
 */

import { mapLoginDtoToLoginResult } from '../mapLoginDtoToLoginResult';
import type { LoginResponse as LoginResponseDto } from '../../api';

describe('mapLoginDtoToLoginResult timezone handling', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-08-06T16:00:00.000Z')); // Current time: 4 PM UTC
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const createMockLoginDto = (
    sessionExpiresAt: string,
    refreshExpiresAt: string
  ): LoginResponseDto => ({
    sessionToken: {
      token: 'test-session-token',
      expiresAt: sessionExpiresAt,
    },
    refreshToken: {
      token: 'test-refresh-token',
      expiresAt: refreshExpiresAt,
    },
  });

  it('should correctly parse UTC dates with Z suffix', () => {
    const dto = createMockLoginDto(
      '2025-08-06T17:00:00.000Z', // 5 PM UTC
      '2025-08-07T16:00:00.000Z'  // 4 PM UTC next day
    );

    const result = mapLoginDtoToLoginResult(dto);

    // Should be parsed as 5 PM UTC (1 hour in future)
    expect(result.sessionExpiresAt.toISOString()).toBe('2025-08-06T17:00:00.000Z');
    expect(result.sessionExpiresAt.getTime()).toBe(1754499600000);
    
    // Should be 1 hour in the future
    expect(result.sessionExpiresAt.getTime() > Date.now()).toBe(true);
  });

  it('should correctly parse UTC dates without Z suffix (the bug case)', () => {
    const dto = createMockLoginDto(
      '2025-08-06T17:00:00.000', // 5 PM, no timezone info
      '2025-08-07T16:00:00.000'  // 4 PM next day, no timezone info
    );

    const result = mapLoginDtoToLoginResult(dto);

    // Should be parsed as 5 PM UTC (1 hour in future), NOT as local time
    expect(result.sessionExpiresAt.toISOString()).toBe('2025-08-06T17:00:00.000Z');
    expect(result.sessionExpiresAt.getTime()).toBe(1754499600000);
    
    // Should be 1 hour in the future (not in the past due to timezone misinterpretation)
    expect(result.sessionExpiresAt.getTime() > Date.now()).toBe(true);
  });

  it('should handle dates with explicit timezone offsets', () => {
    const dto = createMockLoginDto(
      '2025-08-06T19:00:00.000+02:00', // 7 PM CEST = 5 PM UTC
      '2025-08-07T18:00:00.000+02:00'  // 6 PM CEST = 4 PM UTC
    );

    const result = mapLoginDtoToLoginResult(dto);

    // Should be converted to UTC correctly
    expect(result.sessionExpiresAt.toISOString()).toBe('2025-08-06T17:00:00.000Z');
    expect(result.sessionExpiresAt.getTime()).toBe(1754499600000);
  });

  it('should handle different date formats consistently', () => {
    const testCases = [
      '2025-08-06T17:00:00.000Z',     // UTC with Z
      '2025-08-06T17:00:00.000',      // No timezone info
      '2025-08-06T19:00:00.000+02:00', // With timezone offset
    ];

    const expectedUtcTime = 1754499600000; // 5 PM UTC

    testCases.forEach((dateString, index) => {
      const dto = createMockLoginDto(dateString, '2025-08-07T16:00:00.000Z');
      const result = mapLoginDtoToLoginResult(dto);
      
      expect(result.sessionExpiresAt.getTime()).toBe(expectedUtcTime);
      expect(result.sessionExpiresAt.toISOString()).toBe('2025-08-06T17:00:00.000Z');
    });
  });

  it('should validate that timezone bug is fixed', () => {
    // This is the specific case that was causing the bug
    const problematicDto = createMockLoginDto(
      '2025-08-06T17:00:00.000', // No Z suffix - was being parsed as local time
      '2025-08-07T16:00:00.000'
    );

    const result = mapLoginDtoToLoginResult(problematicDto);

    // Before the fix: this would be parsed as local time and getTime() would be different
    // After the fix: should be consistently parsed as UTC
    const expectedUtcTime = new Date('2025-08-06T17:00:00.000Z').getTime();
    
    expect(result.sessionExpiresAt.getTime()).toBe(expectedUtcTime);
    
    // The token should NOT be expired (it's 1 hour in the future)
    const isExpired = Date.now() > result.sessionExpiresAt.getTime();
    expect(isExpired).toBe(false);
  });
});
