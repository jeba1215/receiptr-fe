#!/usr/bin/env node

/**
 * Environment Configuration Test Script
 * Run this script to verify that environment variables are being loaded correctly.
 */

// Mock expo-constants since this will run in Node.js
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      environment: process.env.EXPO_PUBLIC_ENVIRONMENT,
    },
  },
}));

// Import our config after mocking
const { config, apiUrl, environment, isDevelopment, isProduction } = require('../src/config');

console.log('🔧 Environment Configuration Test');
console.log('================================');
console.log('');

// Display current environment variables
console.log('📋 Environment Variables:');
console.log(`   EXPO_PUBLIC_API_URL: ${process.env.EXPO_PUBLIC_API_URL || '❌ Not set'}`);
console.log(`   EXPO_PUBLIC_ENVIRONMENT: ${process.env.EXPO_PUBLIC_ENVIRONMENT || '❌ Not set'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || '❌ Not set'}`);
console.log('');

// Display loaded configuration
console.log('⚙️  Loaded Configuration:');
console.log(`   API URL: ${apiUrl}`);
console.log(`   Environment: ${environment}`);
console.log(`   Is Development: ${isDevelopment}`);
console.log(`   Is Production: ${isProduction}`);
console.log('');

// Validate configuration
console.log('✅ Validation:');

if (!apiUrl) {
  console.log('   ❌ API URL is missing');
  process.exit(1);
} else {
  console.log('   ✅ API URL is configured');
}

if (!environment || !['development', 'production'].includes(environment)) {
  console.log('   ❌ Environment is invalid or missing');
  process.exit(1);
} else {
  console.log('   ✅ Environment is valid');
}

if (isDevelopment && apiUrl.includes('localhost')) {
  console.log('   ✅ Development configuration looks correct');
} else if (isProduction && apiUrl.includes('reciply.org')) {
  console.log('   ✅ Production configuration looks correct');
} else {
  console.log('   ⚠️  Configuration might not match environment');
}

console.log('');
console.log('🎉 Configuration test completed successfully!');
