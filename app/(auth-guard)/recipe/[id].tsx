import { apiHandlers } from '@/src/apiConfig';
import { RecipeRoot } from '@/useCase/recipe/RecipeRoot';

export default function RecipeDetail() {
  return <RecipeRoot recipeApiHandler={apiHandlers.recipe} />;
}