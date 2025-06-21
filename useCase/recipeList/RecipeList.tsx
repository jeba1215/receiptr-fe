import {Text} from "react-native";

type RecipeListProps = {
  test: string
}

export const RecipeList = ({ test }: RecipeListProps) => {
  return (
    <div>
      <Text>Recipe List</Text>
      <Text>{test}</Text>
    </div>
  );
};