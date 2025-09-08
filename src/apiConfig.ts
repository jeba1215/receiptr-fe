/**
 * API Configuration
 * Configure the OpenAPI client and create API handler instances
 */

import { apiUrl } from './config';
import { OpenAPI } from './external/api/core/OpenAPI';
import { LoginApiHandler } from './external/handlers/loginApiHandler';
import { RecipeApiHandler } from './external/handlers/recipeApiHandler';
import { RecipeListApiHandler } from './external/handlers/recipeListApiHandler';

// Configure the base URL for the API client from environment configuration
OpenAPI.BASE = apiUrl;

// Create singleton instances of API handlers
export const loginApiHandler = new LoginApiHandler();
export const recipeListApiHandler = new RecipeListApiHandler();
export const recipeApiHandler = new RecipeApiHandler();

// Export for easy access
export const apiHandlers = {
  login: loginApiHandler,
  recipeList: recipeListApiHandler,
  recipe: recipeApiHandler,
};