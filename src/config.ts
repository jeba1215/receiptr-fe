/**
 * Global Configuration
 * Centralized access to environment variables and app configuration
 */

import Constants from 'expo-constants';

export interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'production';
}

/**
 * Get configuration from expo constants or environment variables
 * Priority: Constants.expoConfig.extra > process.env
 */
const getConfig = (): AppConfig => {
  // Try to get from expo constants first (preferred method)
  const expoExtra = Constants.expoConfig?.extra;

  if (expoExtra?.apiUrl && expoExtra?.environment) {
    return {
      apiUrl: expoExtra.apiUrl,
      environment: expoExtra.environment,
    };
  }

  // Fallback to process.env (useful for development/testing)
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const environment = process.env.EXPO_PUBLIC_ENVIRONMENT as 'development' | 'production';

  if (!apiUrl) {
    throw new Error(
      'API_URL not configured. Please ensure EXPO_PUBLIC_API_URL is set in your environment variables or app.config.ts extra configuration.'
    );
  }

  return {
    apiUrl,
    environment: environment || 'development',
  };
};

// Create singleton config instance
export const config = getConfig();

// Export individual config values for convenience
export const { apiUrl, environment } = config;

// Environment helpers
export const isDevelopment = environment === 'development';
export const isProduction = environment === 'production';

// Type guard for environment
export const isValidEnvironment = (env: string): env is 'development' | 'production' => {
  return env === 'development' || env === 'production';
};

export default config;
