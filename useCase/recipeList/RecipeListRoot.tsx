import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RecipeList } from './RecipeList';
import { mapReceiptToRecipeListItem } from './mappers';
import type { RecipeListItem, RecipeListRootProps } from './types';

export type Recipe = RecipeListItem; // For backward compatibility with existing RecipeList component

export const RecipeListRoot: React.FC<RecipeListRootProps> = ({ recipeListApiHandler }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const receipts = await recipeListApiHandler.getAllReceipts();
        const mappedRecipes = receipts.map(mapReceiptToRecipeListItem);
        setRecipes(mappedRecipes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
        console.error('Error fetching recipes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [recipeListApiHandler]);

  const handleRecipePress = (recipeId: string) => {
    router.push(`../recipe/${recipeId}`);
  };

  if (error) {
    return <div>Error: {error}</div>; // Replace with proper error component
  }

  if (isLoading) {
    return <div>Loading recipes...</div>; // Replace with proper loading component
  }

  return (
    <RecipeList
      recipes={recipes}
      onRecipePress={handleRecipePress}
    />
  );
};