import { render } from "@/src/testHelpers";
import { Recipe } from "../recipe/Recipe";

const mockRecipe = {
  id: '1',
  title: 'Test Recipe',
  thumbnail: 'https://example.com/image.jpg',
  description: 'A delicious test recipe',
  ingredients: ['Ingredient 1', 'Ingredient 2'],
  instructions: ['Step 1', 'Step 2']
};

describe('Recipe', () => {
  it('renders recipe title and description', () => {
    const screen = render(<Recipe recipe={mockRecipe} />);
    
    expect(screen.queryByText('Test Recipe')).toBeTruthy();
    expect(screen.queryByText('A delicious test recipe')).toBeTruthy();
  });

  it('renders ingredients section', () => {
    const screen = render(<Recipe recipe={mockRecipe} />);
    
    expect(screen.queryByText('Ingredients')).toBeTruthy();
    expect(screen.queryByText('• Ingredient 1')).toBeTruthy();
    expect(screen.queryByText('• Ingredient 2')).toBeTruthy();
  });

  it('renders instructions section', () => {
    const screen = render(<Recipe recipe={mockRecipe} />);
    
    expect(screen.queryByText('Instructions')).toBeTruthy();
    expect(screen.queryByText('1. Step 1')).toBeTruthy();
    expect(screen.queryByText('2. Step 2')).toBeTruthy();
  });

  it('renders error message when recipe is null', () => {
    const screen = render(<Recipe recipe={null} />);
    
    expect(screen.queryByText('Recipe not found')).toBeTruthy();
    expect(screen.queryByText('Test Recipe')).toBeFalsy();
  });
});