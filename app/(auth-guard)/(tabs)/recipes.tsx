import { apiHandlers } from '@/src/apiConfig';
import { RecipeListRoot } from '@/useCase/recipeList/RecipeListRoot';

export default function Recipes() {
  return <RecipeListRoot recipeListApiHandler={apiHandlers.recipeList} />;
}