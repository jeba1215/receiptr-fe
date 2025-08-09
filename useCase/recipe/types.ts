/**
 * Recipe use case specific data types
 * These types are owned by the Recipe use case
 */

import type { RecipeApiHandler } from '../../src/external/handlers';

// Route-specific Recipe type for the individual recipe view
export interface RecipeDetail {
  readonly id: string; // Converted from number to string for route consistency  
  title: string;
  thumbnail: string;
  description: string;
  amount: number;
  createdAt: Date;
  // Default fields for compatibility with existing Recipe component
  ingredients: string[];
  instructions: string[];
}

// Props interface for RecipeRoot
export interface RecipeRootProps {
  recipeApiHandler: RecipeApiHandler;
}
