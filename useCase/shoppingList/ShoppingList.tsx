import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export type ShoppingListItem = {
  id: string;
  name: string;
  checked: boolean;
};

type ShoppingListProps = {
  items: ShoppingListItem[];
  onCheck: (itemId: string) => void;
};

export const ShoppingList = ({ items, onCheck }: ShoppingListProps) => {
  const renderItem = ({ item }: { item: ShoppingListItem }) => (
    <View style={styles.itemContainer}>
      <Text style={[styles.itemName, item.checked && styles.checkedItem]}>
        {item.name}
      </Text>
      <TouchableOpacity
        style={[styles.checkbox, item.checked && styles.checkedBox]}
        onPress={() => onCheck(item.id)}
        testID={`checkbox-${item.id}`}
        accessibilityRole="button"
        accessibilityLabel={`Mark ${item.name} as ${item.checked ? 'not bought' : 'bought'}`}
      >
        {item.checked && (
          <Ionicons name="checkmark" size={16} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );

  const uncheckedItems = items.filter(item => !item.checked);
  const checkedItems = items.filter(item => item.checked);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping List</Text>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {uncheckedItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>To Buy ({uncheckedItems.length})</Text>
            <FlatList
              data={uncheckedItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {checkedItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bought ({checkedItems.length})</Text>
            <FlatList
              data={checkedItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {items.length === 0 && (
          <Text style={styles.emptyText}>No items in your shopping list</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3a3f47',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  checkedItem: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
});