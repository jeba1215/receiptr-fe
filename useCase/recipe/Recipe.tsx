import { ScrollView, StyleSheet } from 'react-native';
import { Card, Surface, Text, Title } from 'react-native-paper';

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
      <Surface style={styles.container}>
        <Text variant="headlineSmall" style={styles.errorText}>
          Recipe not found
        </Text>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <ScrollView>
        <Card style={styles.imageCard}>
          <Card.Cover source={{ uri: recipe.thumbnail }} style={styles.image} />
        </Card>
        
        <Card style={styles.content}>
          <Card.Content>
            <Title style={styles.title}>{recipe.title}</Title>
            <Text variant="bodyLarge" style={styles.description}>
              {recipe.description}
            </Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Ingredients
            </Text>
            {recipe.ingredients.map((ingredient, index) => (
              <Text key={index} variant="bodyMedium" style={styles.ingredient}>
                • {ingredient}
              </Text>
            ))}
          </Card.Content>
        </Card>
        
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Instructions
            </Text>
            {recipe.instructions.map((instruction, index) => (
              <Text key={index} variant="bodyMedium" style={styles.instruction}>
                {index + 1}. {instruction}
              </Text>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageCard: {
    margin: 0,
    borderRadius: 0,
  },
  image: {
    height: 250,
  },
  content: {
    margin: 16,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 8,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  ingredient: {
    marginBottom: 8,
  },
  instruction: {
    marginBottom: 12,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
  },
});