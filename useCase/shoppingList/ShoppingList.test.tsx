import { render, fireEvent } from "@/src/testHelpers";
import { ShoppingList } from "./ShoppingList";

const mockItems = [
  { id: '1', name: 'Spaghetti', checked: false },
  { id: '2', name: 'Eggs', checked: true },
  { id: '3', name: 'Cheese', checked: false }
];

describe('ShoppingList', () => {
  it('renders shopping list header', () => {
    const mockOnCheck = jest.fn();
    const screen = render(<ShoppingList items={mockItems} onCheck={mockOnCheck} />);
    expect(screen.queryByText('Shopping List')).toBeTruthy();
  });

  it('renders unchecked items in "To Buy" section', () => {
    const mockOnCheck = jest.fn();
    const screen = render(<ShoppingList items={mockItems} onCheck={mockOnCheck} />);
    
    expect(screen.queryByText('To Buy (2)')).toBeTruthy();
    expect(screen.queryByText('Spaghetti')).toBeTruthy();
    expect(screen.queryByText('Cheese')).toBeTruthy();
  });

  it('renders checked items in "Bought" section', () => {
    const mockOnCheck = jest.fn();
    const screen = render(<ShoppingList items={mockItems} onCheck={mockOnCheck} />);
    
    expect(screen.queryByText('Bought (1)')).toBeTruthy();
    expect(screen.queryByText('Eggs')).toBeTruthy();
  });

  it('calls onCheck when checkbox is pressed', () => {
    const mockOnCheck = jest.fn();
    const screen = render(<ShoppingList items={mockItems} onCheck={mockOnCheck} />);
    
    const checkbox = screen.getByTestId('checkbox-1');
    fireEvent.press(checkbox);
    
    expect(mockOnCheck).toHaveBeenCalledWith('1');
  });

  it('renders empty message when no items', () => {
    const mockOnCheck = jest.fn();
    const screen = render(<ShoppingList items={[]} onCheck={mockOnCheck} />);
    
    expect(screen.queryByText('No items in your shopping list')).toBeTruthy();
    expect(screen.queryByText('To Buy')).toBeFalsy();
    expect(screen.queryByText('Bought')).toBeFalsy();
  });

  it('does not render "To Buy" section when all items are checked', () => {
    const allCheckedItems = [
      { id: '1', name: 'Spaghetti', checked: true },
      { id: '2', name: 'Eggs', checked: true }
    ];
    const mockOnCheck = jest.fn();
    const screen = render(<ShoppingList items={allCheckedItems} onCheck={mockOnCheck} />);
    
    expect(screen.queryByText('To Buy')).toBeFalsy();
    expect(screen.queryByText('Bought (2)')).toBeTruthy();
  });

  it('does not render "Bought" section when no items are checked', () => {
    const allUncheckedItems = [
      { id: '1', name: 'Spaghetti', checked: false },
      { id: '2', name: 'Eggs', checked: false }
    ];
    const mockOnCheck = jest.fn();
    const screen = render(<ShoppingList items={allUncheckedItems} onCheck={mockOnCheck} />);
    
    expect(screen.queryByText('To Buy (2)')).toBeTruthy();
    expect(screen.queryByText('Bought')).toBeFalsy();
  });
});