import { render, fireEvent } from "@testing-library/react-native";
import { RecipeList } from "../recipeList/RecipeList";

const mockRecipes = [
  {
    id: '1',
    title: 'Test Recipe 1',
    thumbnail: 'https://example.com/image1.jpg'
  },
  {
    id: '2',
    title: 'Test Recipe 2',
    thumbnail: 'https://example.com/image2.jpg'
  }
];

describe('RecipeList', () => {
  it('renders recipe list header', () => {
    const mockOnPress = jest.fn();
    const screen = render(<RecipeList recipes={mockRecipes} onRecipePress={mockOnPress} />);
    expect(screen.queryByText('Recipe List')).toBeTruthy();
  });

  it('renders all recipe items', () => {
    const mockOnPress = jest.fn();
    const screen = render(<RecipeList recipes={mockRecipes} onRecipePress={mockOnPress} />);
    
    expect(screen.queryByText('Test Recipe 1')).toBeTruthy();
    expect(screen.queryByText('Test Recipe 2')).toBeTruthy();
  });

  it('calls onRecipePress when recipe is tapped', () => {
    const mockOnPress = jest.fn();
    const screen = render(<RecipeList recipes={mockRecipes} onRecipePress={mockOnPress} />);
    
    const firstRecipe = screen.getByText('Test Recipe 1');
    fireEvent.press(firstRecipe);
    
    expect(mockOnPress).toHaveBeenCalledWith('1');
  });

  it('renders empty list when no recipes provided', () => {
    const mockOnPress = jest.fn();
    const screen = render(<RecipeList recipes={[]} onRecipePress={mockOnPress} />);
    
    expect(screen.queryByText('Recipe List')).toBeTruthy();
    expect(screen.queryByText('Test Recipe 1')).toBeFalsy();
  });
});