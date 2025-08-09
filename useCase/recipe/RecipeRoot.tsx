import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Recipe } from './Recipe';
import { mapReceiptToRecipeDetail } from './mappers';
import type { RecipeDetail, RecipeRootProps } from './types';

export type RecipeData = RecipeDetail; // For backward compatibility with existing Recipe component

export const RecipeRoot: React.FC<RecipeRootProps> = ({ recipeApiHandler }) => {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id || typeof id !== 'string') {
        setError('Invalid recipe ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const receipt = await recipeApiHandler.getReceipt(parseInt(id), 'current-user-id'); // TODO: Get actual user ID
        const mappedRecipe = mapReceiptToRecipeDetail(receipt);
        setRecipe(mappedRecipe);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recipe');
        console.error('Error fetching recipe:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id, recipeApiHandler]);

  if (error) {
    return <div>Error: {error}</div>; // Replace with proper error component
  }

  if (isLoading) {
    return <div>Loading recipe...</div>; // Replace with proper loading component
  }

  if (!recipe) {
    return <div>Recipe not found</div>; // Replace with proper not found component
  }

  return (
    <Recipe recipe={recipe} />
  );
};
