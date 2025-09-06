import { render, fireEvent } from "@/src/testHelpers";
import { ShoppingListRoot } from "./ShoppingListRoot";

describe('ShoppingListRoot', () => {
  it('renders shopping list with initial items', () => {
    const screen = render(<ShoppingListRoot />);
    
    expect(screen.queryByText('Shopping List')).toBeTruthy();
    expect(screen.queryByText('Spaghetti')).toBeTruthy();
    expect(screen.queryByText('Pancetta')).toBeTruthy();
  });

  it('toggles item checked state when checkbox is pressed', () => {
    const screen = render(<ShoppingListRoot />);
    
    // Initially Spaghetti should be unchecked (in "To Buy" section)
    expect(screen.queryByText('To Buy (8)')).toBeTruthy();
    expect(screen.queryByText('Bought (2)')).toBeTruthy();
    
    // Find and press the Spaghetti checkbox
    const spaghettiCheckbox = screen.getByTestId('checkbox-1');
    fireEvent.press(spaghettiCheckbox);
    
    // Now should have 7 unchecked and 3 checked items
    expect(screen.queryByText('To Buy (7)')).toBeTruthy();
    expect(screen.queryByText('Bought (3)')).toBeTruthy();
  });

  it('unchecks already checked items when pressed', () => {
    const screen = render(<ShoppingListRoot />);
    
    // Initially should have 2 checked items
    expect(screen.queryByText('Bought (2)')).toBeTruthy();
    
    // Press the Eggs checkbox (which is initially checked, id: '3')
    const eggsCheckbox = screen.getByTestId('checkbox-3');
    fireEvent.press(eggsCheckbox);
    
    // Should now have 1 checked item
    expect(screen.queryByText('Bought (1)')).toBeTruthy();
    expect(screen.queryByText('To Buy (9)')).toBeTruthy();
  });
});