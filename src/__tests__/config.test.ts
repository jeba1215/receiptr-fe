/**
 * Tests for global configuration
 */

import { apiUrl, config, environment, isDevelopment, isProduction, isValidEnvironment } from '../config';

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      apiUrl: 'https://api.reciply.org',
      environment: 'production',
    },
  },
}));

describe('Global Configuration', () => {
  describe('config object', () => {
    it('should return configuration from expo constants', () => {
      expect(config.apiUrl).toBe('https://api.reciply.org');
      expect(config.environment).toBe('production');
    });

    it('should export individual config values', () => {
      expect(apiUrl).toBe('https://api.reciply.org');
      expect(environment).toBe('production');
    });
  });

  describe('environment helpers', () => {
    it('should correctly identify production environment', () => {
      expect(isDevelopment).toBe(false);
      expect(isProduction).toBe(true);
    });
  });

  describe('isValidEnvironment', () => {
    it('should return true for valid environments', () => {
      expect(isValidEnvironment('development')).toBe(true);
      expect(isValidEnvironment('production')).toBe(true);
    });

    it('should return false for invalid environments', () => {
      expect(isValidEnvironment('staging')).toBe(false);
      expect(isValidEnvironment('test')).toBe(false);
      expect(isValidEnvironment('')).toBe(false);
    });
  });
});

describe('Fallback to process.env', () => {
  beforeAll(() => {
    // Mock Constants to return undefined extra
    jest.doMock('expo-constants', () => ({
      expoConfig: {
        extra: undefined,
      },
    }));

    // Set process.env variables
    process.env.EXPO_PUBLIC_API_URL = 'http://localhost:8086';
    process.env.EXPO_PUBLIC_ENVIRONMENT = 'development';
  });

  afterAll(() => {
    // Clean up
    delete process.env.EXPO_PUBLIC_API_URL;
    delete process.env.EXPO_PUBLIC_ENVIRONMENT;
    jest.clearAllMocks();
  });

  it('should fallback to process.env when expo constants are not available', () => {
    // Re-import to get fresh instance with mocked constants
    jest.resetModules();
    const { config: fallbackConfig } = require('../config');

    expect(fallbackConfig.apiUrl).toBe('http://localhost:8086');
    expect(fallbackConfig.environment).toBe('development');
  });
});

describe('Error handling', () => {
  beforeAll(() => {
    // Mock Constants to return undefined extra
    jest.doMock('expo-constants', () => ({
      expoConfig: {
        extra: undefined,
      },
    }));

    // Remove process.env variables
    delete process.env.EXPO_PUBLIC_API_URL;
    delete process.env.EXPO_PUBLIC_ENVIRONMENT;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should throw error when no API URL is configured', () => {
    jest.resetModules();

    expect(() => {
      require('../config');
    }).toThrow('API_URL not configured');
  });
});
