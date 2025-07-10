import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

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
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() => onRecipePress(item.id)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recipe List</Text>
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
    backgroundColor: '#3a3f47',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  thumbnail: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});