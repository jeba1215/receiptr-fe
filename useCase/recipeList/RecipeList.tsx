import { FlatList, StyleSheet } from 'react-native';
import { Card, Surface, Title, Text } from 'react-native-paper';

export type Recipe = {
  id: string;
  title: string;
  thumbnail: string;
};

type RecipeListProps = {
  recipes: Recipe[];
  onRecipePress: (recipeId: string) => void;
};

export const RecipeList = ({ recipes, onRecipePress }: RecipeListProps) => {
  const renderRecipe = ({ item }: { item: Recipe }) => (
    <Card 
      style={styles.recipeItem}
      onPress={() => onRecipePress(item.id)}
    >
      <Card.Cover source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <Card.Content style={styles.cardContent}>
        <Text variant="titleSmall" style={styles.title}>
          {item.title}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <Surface style={styles.container}>
      <Title style={styles.header}>Recipe List</Title>
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recipeItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  thumbnail: {
    height: 120,
  },
  cardContent: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
});