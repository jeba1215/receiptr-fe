import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export type RecipeData = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  ingredients: string[];
  instructions: string[];
};

type RecipeProps = {
  recipe: RecipeData | null;
};

export const Recipe = ({ recipe }: RecipeProps) => {
  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Recipe not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.thumbnail }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.description}>{recipe.description}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              • {ingredient}
            </Text>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.instructions.map((instruction, index) => (
            <Text key={index} style={styles.instruction}>
              {index + 1}. {instruction}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 24,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  ingredient: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 8,
    lineHeight: 24,
  },
  instruction: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 12,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
});