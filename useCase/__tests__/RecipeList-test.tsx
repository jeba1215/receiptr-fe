import {render} from "@testing-library/react-native";
import { RecipeList } from "../recipeList/RecipeList";

describe('RecipeList', () => {
  it('renders without crashing', () => {
    const testText = 'test';
    const screen = render(<RecipeList test={testText} />);
    expect(screen.queryByText(/Recipe List/)).toBeTruthy();
    expect(screen.queryByText(testText)).toBeTruthy();
  });
});