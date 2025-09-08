/**
 * Mappers for RecipeList use case
 * Maps from internal domain models to route-specific types
 */

import type { Receipt } from '../../src/models/Receipt';
import type { RecipeListItem } from './types';

/**
 * Maps Receipt to RecipeListItem for the recipe list view
 */
export const mapReceiptToRecipeListItem = (receipt: Receipt): RecipeListItem => {
  return {
    id: receipt.id.toString(), // Convert number to string for route consistency
    title: receipt.description, // Using description as title since that's what we have
    thumbnail: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=Receipt', // Default thumbnail
    amount: receipt.amount,
    createdAt: receipt.createdAt,
  };
};
