# Environment Variables Setup

This project uses environment variables for configuration, allowing different settings for development and production environments.

## Setup Instructions

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` with your local development settings:**
   ```bash
   # Local development
   EXPO_PUBLIC_API_URL=http://localhost:8086
   EXPO_PUBLIC_ENVIRONMENT=development
   ```

## Environment Files

- `.env` - Default environment variables (committed to git)
- `.env.development` - Development environment variables (committed to git)
- `.env.production` - Production environment variables (committed to git)
- `.env.local` - Local overrides (ignored by git)
- `.env.example` - Example file for documentation (committed to git)

## File Priority

Expo loads environment files in this order (later files override earlier ones):
1. `.env`
2. `.env.development` or `.env.production` (based on NODE_ENV)
3. `.env.local`

## Configuration Access

The app configuration is accessible throughout the app via:

```typescript
import { config, apiUrl, environment, isDevelopment } from 'src/config';

// Full config object
console.log(config);

// Individual values
console.log('API URL:', apiUrl);
console.log('Environment:', environment);
console.log('Is Development:', isDevelopment);
```

## Running Different Environments

- **Development (default):**
  ```bash
  npm start
  # or
  npx expo start
  ```

- **Production:**
  ```bash
  NODE_ENV=production npm start
  # or
  NODE_ENV=production npx expo start
  ```

## Production Deployment

For production builds:
1. Ensure `EXPO_PUBLIC_API_URL=https://api.reciply.org` is set
2. Ensure `EXPO_PUBLIC_ENVIRONMENT=production` is set
3. Build the app with appropriate build commands

## Troubleshooting

- **"API_URL not configured" error:** Make sure you have environment variables set up properly
- **Wrong API URL:** Check your `.env.local` file and environment variable loading
- **Environment not switching:** Make sure you're setting `NODE_ENV` correctly

## Adding New Environment Variables

1. Add the variable to the appropriate `.env.*` files with `EXPO_PUBLIC_` prefix
2. Update `app.config.ts` to pass the variable through the `extra` object
3. Update `src/config.ts` to read and validate the new variable
4. Update this README with documentation for the new variable
