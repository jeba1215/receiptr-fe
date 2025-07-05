import { router } from 'expo-router';
import { RecipeList } from './RecipeList';

export type Recipe = {
  id: string;
  title: string;
  thumbnail: string;
};

const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Spaghetti Carbonara',
    thumbnail: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=Pasta'
  },
  {
    id: '2',
    title: 'Chicken Tikka Masala',
    thumbnail: 'https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=Chicken'
  },
  {
    id: '3',
    title: 'Beef Tacos',
    thumbnail: 'https://via.placeholder.com/150x150/45B7D1/FFFFFF?text=Tacos'
  },
  {
    id: '4',
    title: 'Caesar Salad',
    thumbnail: 'https://via.placeholder.com/150x150/96CEB4/FFFFFF?text=Salad'
  },
  {
    id: '5',
    title: 'Chocolate Cake',
    thumbnail: 'https://via.placeholder.com/150x150/FFEAA7/FFFFFF?text=Cake'
  },
  {
    id: '6',
    title: 'Grilled Salmon',
    thumbnail: 'https://via.placeholder.com/150x150/DDA0DD/FFFFFF?text=Salmon'
  }
];

export const RecipeListRoot = () => {
  const handleRecipePress = (recipeId: string) => {
    router.push(`../recipe/${recipeId}`);
  };

  return (
    <RecipeList 
      recipes={mockRecipes} 
      onRecipePress={handleRecipePress}
    />
  );
};