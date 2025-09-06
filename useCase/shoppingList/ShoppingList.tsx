import { FlatList, ScrollView, StyleSheet } from 'react-native';
import { Card, Checkbox, List, Surface, Text, Title } from 'react-native-paper';

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
    <List.Item
      title={item.name}
      titleStyle={item.checked ? styles.checkedItem : undefined}
      right={() => (
        <Checkbox
          status={item.checked ? 'checked' : 'unchecked'}
          onPress={() => onCheck(item.id)}
          testID={`checkbox-${item.id}`}
        />
      )}
      onPress={() => onCheck(item.id)}
      style={styles.listItem}
    />
  );

  const uncheckedItems = items.filter(item => !item.checked);
  const checkedItems = items.filter(item => item.checked);

  return (
    <Surface style={styles.container}>
      <Title style={styles.header}>Shopping List</Title>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {uncheckedItems.length > 0 && (
          <Card style={styles.section}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                To Buy ({uncheckedItems.length})
              </Text>
              <FlatList
                data={uncheckedItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </Card.Content>
          </Card>
        )}

        {checkedItems.length > 0 && (
          <Card style={styles.section}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Bought ({checkedItems.length})
              </Text>
              <FlatList
                data={checkedItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </Card.Content>
          </Card>
        )}

        {items.length === 0 && (
          <Text variant="bodyLarge" style={styles.emptyText}>
            No items in your shopping list
          </Text>
        )}
      </ScrollView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  listItem: {
    paddingHorizontal: 0,
  },
  checkedItem: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
  },
});