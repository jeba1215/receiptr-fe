/**
 * API Configuration
 * Configure the OpenAPI client and create API handler instances
 */

import { OpenAPI } from './external/api';
import { LoginApiHandler, RecipeApiHandler, RecipeListApiHandler } from './external/handlers';

// Configure the base URL for the API client
OpenAPI.BASE = 'http://localhost:8086'; // Adjust this to match your backend URL

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