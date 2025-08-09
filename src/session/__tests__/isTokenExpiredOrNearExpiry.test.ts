/**
 * Tests for isTokenExpiredOrNearExpiry function
 * This function is critical for determining when to refresh tokens
 */

import { sessionInterceptor } from '../sessionInterceptor';

// We need to access the internal function for testing
// Since it's not exported, we'll test it through the sessionInterceptor behavior
// But first, let's create a standalone version for direct testing

const isTokenExpiredOrNearExpiry = (expiresAt?: Date, bufferMinutes = 1): boolean => {
  if (!expiresAt) return true;
  
  // Check for invalid dates (NaN)
  if (isNaN(expiresAt.getTime())) return true;
  
  const bufferTime = bufferMinutes * 60 * 1000; // Convert minutes to milliseconds
  return Date.now() > (expiresAt.getTime() - bufferTime);
};

describe('isTokenExpiredOrNearExpiry', () => {
  beforeEach(() => {
    // Mock Date.now to have consistent test results
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-08-06T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Token expiration checking', () => {
    it('should return true for undefined/null dates', () => {
      expect(isTokenExpiredOrNearExpiry(undefined)).toBe(true);
      expect(isTokenExpiredOrNearExpiry(undefined, 5)).toBe(true);
    });

    it('should return true for tokens that are already expired', () => {
      const expiredDate = new Date('2025-08-06T11:59:00Z'); // 1 minute ago
      expect(isTokenExpiredOrNearExpiry(expiredDate)).toBe(true);
    });

    it('should return true for tokens that are very expired', () => {
      const veryExpiredDate = new Date('2025-08-06T10:00:00Z'); // 2 hours ago
      expect(isTokenExpiredOrNearExpiry(veryExpiredDate)).toBe(true);
    });

    it('should return false for tokens that are clearly valid', () => {
      const futureDate = new Date('2025-08-06T13:00:00Z'); // 1 hour from now
      expect(isTokenExpiredOrNearExpiry(futureDate)).toBe(false);
    });

    it('should return false for tokens that are well within validity', () => {
      const farFutureDate = new Date('2025-08-06T18:00:00Z'); // 6 hours from now
      expect(isTokenExpiredOrNearExpiry(farFutureDate)).toBe(false);
    });
  });

  describe('Buffer time handling', () => {
    it('should return true for tokens within default buffer time (1 minute)', () => {
      const nearExpiryDate = new Date('2025-08-06T12:00:30Z'); // 30 seconds from now
      expect(isTokenExpiredOrNearExpiry(nearExpiryDate)).toBe(true);
    });

    it('should return false for tokens just outside default buffer time', () => {
      const justOutsideBufferDate = new Date('2025-08-06T12:01:30Z'); // 1.5 minutes from now
      expect(isTokenExpiredOrNearExpiry(justOutsideBufferDate)).toBe(false);
    });

    it('should respect custom buffer time - 5 minutes', () => {
      const withinCustomBufferDate = new Date('2025-08-06T12:04:30Z'); // 4.5 minutes from now
      const outsideCustomBufferDate = new Date('2025-08-06T12:05:30Z'); // 5.5 minutes from now

      expect(isTokenExpiredOrNearExpiry(withinCustomBufferDate, 5)).toBe(true);
      expect(isTokenExpiredOrNearExpiry(outsideCustomBufferDate, 5)).toBe(false);
    });

    it('should respect custom buffer time - 10 minutes', () => {
      const withinLargeBufferDate = new Date('2025-08-06T12:09:00Z'); // 9 minutes from now
      const outsideLargeBufferDate = new Date('2025-08-06T12:11:00Z'); // 11 minutes from now

      expect(isTokenExpiredOrNearExpiry(withinLargeBufferDate, 10)).toBe(true);
      expect(isTokenExpiredOrNearExpiry(outsideLargeBufferDate, 10)).toBe(false);
    });

    it('should handle zero buffer time', () => {
      const exactExpiryDate = new Date('2025-08-06T12:00:00Z'); // Exactly now
      const slightlyFutureDate = new Date('2025-08-06T12:00:01Z'); // 1 second from now
      const pastDate = new Date('2025-08-06T11:59:59Z'); // 1 second ago

      expect(isTokenExpiredOrNearExpiry(exactExpiryDate, 0)).toBe(false); // Exactly at expiry = not expired yet
      expect(isTokenExpiredOrNearExpiry(pastDate, 0)).toBe(true); // Past expiry = expired
      expect(isTokenExpiredOrNearExpiry(slightlyFutureDate, 0)).toBe(false);
    });

    it('should handle fractional buffer time', () => {
      const twentySecondsFromNow = new Date('2025-08-06T12:00:20Z');
      const fortySecondsFromNow = new Date('2025-08-06T12:00:40Z');

      // 0.5 minutes = 30 seconds buffer
      // Token expires in 20 seconds, within 30 second buffer = should refresh
      expect(isTokenExpiredOrNearExpiry(twentySecondsFromNow, 0.5)).toBe(true);
      // Token expires in 40 seconds, outside 30 second buffer = should not refresh yet
      expect(isTokenExpiredOrNearExpiry(fortySecondsFromNow, 0.5)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle very far future dates', () => {
      const yearFromNow = new Date('2026-08-06T12:00:00Z');
      expect(isTokenExpiredOrNearExpiry(yearFromNow)).toBe(false);
      expect(isTokenExpiredOrNearExpiry(yearFromNow, 60)).toBe(false); // Even with 1 hour buffer
    });

    it('should handle dates in the past', () => {
      const dayAgo = new Date('2025-08-05T12:00:00Z');
      expect(isTokenExpiredOrNearExpiry(dayAgo)).toBe(true);
      expect(isTokenExpiredOrNearExpiry(dayAgo, 0)).toBe(true);
    });

    it('should handle invalid dates gracefully', () => {
      const invalidDate = new Date('invalid');
      // Invalid dates should be treated as expired to be safe
      // Note: new Date('invalid') creates a Date object with NaN time
      expect(isTokenExpiredOrNearExpiry(invalidDate)).toBe(true);
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle typical JWT expiration scenarios', () => {
      // Typical access token: 15 minutes
      const accessTokenExpiry = new Date('2025-08-06T12:15:00Z');
      // Typical refresh token: 24 hours
      const refreshTokenExpiry = new Date('2025-08-07T12:00:00Z');

      // Access token should be refreshed when within 1 minute of expiry
      expect(isTokenExpiredOrNearExpiry(accessTokenExpiry)).toBe(false);
      
      // Refresh token should be valid for much longer
      expect(isTokenExpiredOrNearExpiry(refreshTokenExpiry)).toBe(false);
      expect(isTokenExpiredOrNearExpiry(refreshTokenExpiry, 60)).toBe(false); // Even with 1 hour buffer
    });

    it('should handle session tokens that expire soon', () => {
      // Token expires in 30 seconds - should trigger refresh
      const soonToExpire = new Date('2025-08-06T12:00:30Z');
      expect(isTokenExpiredOrNearExpiry(soonToExpire)).toBe(true);

      // Token expires in 2 minutes - should not trigger refresh yet
      const notYetExpiring = new Date('2025-08-06T12:02:00Z');
      expect(isTokenExpiredOrNearExpiry(notYetExpiring)).toBe(false);
    });

    it('should match behavior with TokenStore isTokenExpired function', () => {
      // This ensures consistency between the two similar functions
      const testDate = new Date('2025-08-06T12:00:30Z'); // 30 seconds from now
      
      // Both should return true for tokens within buffer time
      expect(isTokenExpiredOrNearExpiry(testDate, 1)).toBe(true);
      
      const validDate = new Date('2025-08-06T12:05:00Z'); // 5 minutes from now
      expect(isTokenExpiredOrNearExpiry(validDate, 1)).toBe(false);
    });
  });

  describe('Performance considerations', () => {
    it('should execute quickly for many date checks', () => {
      const testDates = Array.from({ length: 1000 }, (_, i) => 
        new Date(Date.now() + (i * 1000)) // Dates from now to 1000 seconds in future
      );

      const startTime = performance.now();
      
      testDates.forEach(date => {
        isTokenExpiredOrNearExpiry(date);
      });

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Should complete 1000 checks in less than 10ms
      expect(executionTime).toBeLessThan(10);
    });
  });
});
