/**
 * Recipe List use case specific data types
 * These types are owned by the RecipeList use case
 */

import type { RecipeListApiHandler } from '../../src/external/handlers/recipeListApiHandler';

// Route-specific Recipe type for the recipe list view
export interface RecipeListItem {
  readonly id: string; // Converted from number to string for route consistency  
  title: string;
  thumbnail: string;
  amount: number;
  createdAt: Date;
}

// Props interface for RecipeListRoot
export interface RecipeListRootProps {
  recipeListApiHandler: RecipeListApiHandler;
}
