import { useLocalSearchParams } from 'expo-router';
import { Recipe } from './Recipe';

export type RecipeData = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  ingredients: string[];
  instructions: string[];
};

const mockRecipes: Record<string, RecipeData> = {
  '1': {
    id: '1',
    title: 'Spaghetti Carbonara',
    thumbnail: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Pasta',
    description: 'A classic Italian pasta dish with eggs, cheese, and pancetta.',
    ingredients: [
      '400g spaghetti',
      '200g pancetta, diced',
      '3 large eggs',
      '100g Pecorino Romano cheese, grated',
      'Black pepper to taste',
      'Salt for pasta water'
    ],
    instructions: [
      'Cook spaghetti in salted boiling water until al dente.',
      'Meanwhile, cook pancetta in a large pan until crispy.',
      'In a bowl, whisk eggs with grated cheese and black pepper.',
      'Drain pasta and add to the pan with pancetta.',
      'Remove from heat and quickly stir in egg mixture.',
      'Serve immediately with extra cheese and pepper.'
    ]
  },
  '2': {
    id: '2',
    title: 'Chicken Tikka Masala',
    thumbnail: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Chicken',
    description: 'Tender chicken in a creamy, spiced tomato sauce.',
    ingredients: [
      '500g chicken breast, cubed',
      '200ml yogurt',
      '400ml coconut milk',
      '400g canned tomatoes',
      '2 onions, diced',
      'Garam masala, cumin, turmeric',
      'Garlic and ginger'
    ],
    instructions: [
      'Marinate chicken in yogurt and spices for 2 hours.',
      'Cook marinated chicken until browned.',
      'Sauté onions, garlic, and ginger.',
      'Add tomatoes and spices, simmer 10 minutes.',
      'Add coconut milk and cooked chicken.',
      'Simmer until sauce thickens, serve with rice.'
    ]
  }
};

export const RecipeRoot = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const recipe = id ? mockRecipes[id] : null;

  if (!recipe) {
    return <Recipe recipe={null} />;
  }

  return <Recipe recipe={recipe} />;
};