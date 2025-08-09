/**
 * Mappers for Recipe use case
 * Maps from internal domain models to route-specific types
 */

import type { Receipt } from '../../src/models';
import type { RecipeDetail } from './types';

/**
 * Maps Receipt to RecipeDetail for the individual recipe view
 */
export const mapReceiptToRecipeDetail = (receipt: Receipt): RecipeDetail => {
  return {
    id: receipt.id.toString(), // Convert number to string for route consistency
    title: receipt.description, // Using description as title since that's what we have
    thumbnail: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Receipt', // Default thumbnail
    description: receipt.description,
    amount: receipt.amount,
    createdAt: receipt.createdAt,
    // Default values since API doesn't provide these
    ingredients: [`Amount: $${receipt.amount}`],
    instructions: ['Recipe details are not available from the receipt data.'],
  };
};
