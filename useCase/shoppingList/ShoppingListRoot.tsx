import { useState } from 'react';
import { ShoppingList } from './ShoppingList';

export type ShoppingListItem = {
  id: string;
  name: string;
  checked: boolean;
};

const mockShoppingItems: ShoppingListItem[] = [
  { id: '1', name: 'Spaghetti', checked: false },
  { id: '2', name: 'Pancetta', checked: false },
  { id: '3', name: 'Eggs', checked: true },
  { id: '4', name: 'Pecorino Romano cheese', checked: false },
  { id: '5', name: 'Black pepper', checked: false },
  { id: '6', name: 'Chicken breast', checked: false },
  { id: '7', name: 'Coconut milk', checked: false },
  { id: '8', name: 'Canned tomatoes', checked: true },
  { id: '9', name: 'Onions', checked: false },
  { id: '10', name: 'Garlic', checked: false }
];

export const ShoppingListRoot = () => {
  const [items, setItems] = useState<ShoppingListItem[]>(mockShoppingItems);

  const handleCheck = (itemId: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <ShoppingList 
      items={items} 
      onCheck={handleCheck}
    />
  );
};