# Frontend Way of Working - Copilot Optimized

Receipts will be an app for managing recipes and shopping lists. 
We the app will contain receipts and the ability to create shopping lists based on the recipes.

This is a react native expo frontend. 
The backend is written with Java Spring Web API.
We use a PostgreSQL database.

#### Factory Pattern for AI

Create factory functions that Copilot can easily use and extend:

```typescript
// test/factories/productFactory.ts
// Copilot CONTEXT: Factory for generating test data
// Can be extended with additional product types as needed
export const createProduct = (overrides: Partial<Product> = {}): Product => ({
  id: '1',
  name: 'Test Product',
  price: 29.99,
  type: 'standard',
  isDiscounted: false,
  category: 'electronics',
  ...overrides,
});

// Usage in tests - easy for Copilot to understand and replicate
const premiumProduct = createProduct({ type: 'premium', price: 99.99 });
const discountedProduct = createProduct({ isDiscounted: true });
```

### TypeScript with AI Assistance

#### AI-Friendly Type Definitions

Write types that Copilot can understand and extend:

```typescript
// Good - Clear, extendable types that Copilot can work with
export interface UserProfile {
  readonly id: string;
  name: string;
  email: string;
  role: UserRole;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationSettings;
}

// Copilot can easily generate components using these types
```

#### Enum Usage with AI

```typescript
// Copilot CONTEXT: Use these exact enum values throughout the app
// Generate type guards and utility functions as needed
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER", 
  ACCOUNTANT = "ACCOUNTANT",
  MANAGER = "MANAGER"
}

// Copilot can generate type guards like:
export const isAdmin = (role: UserRole): boolean => role === UserRole.ADMIN;
```

### Error Handling with AI

#### AI-Assisted Error Patterns

```typescript
// Copilot CONTEXT: Standard error handling pattern
// Use this pattern consistently across the app
// Generate appropriate error boundaries and fallbacks

export const useErrorHandler = () => {
  const handleError = useCallback((error: Error, context?: string) => {
    // Log to Sentry
    captureException(error, {
      tags: { context },
      level: 'error'
    });
    
    // Show user-friendly message
    toast.error('Something went wrong. Please try again.');
  }, []);
  
  return { handleError };
};

// Usage - Copilot can replicate this pattern
const { handleError } = useErrorHandler();

try {
  await saveUserData(userData);
} catch (error) {
  handleError(error as Error, 'user-profile-save');
}
```

### Formatting and Linting
- Always use Biome for code formatting and linting
- Run Biome before committing any changes
- Configure your editor to format on save using Biome
- Follow Biome's default rules for consistent code style

#### AI-Assisted Formatting
When working with Copilot:
1. Let Copilot generate code first
2. Run Biome formatting on the generated code
3. Review and adjust formatting if needed
4. Ensure all files follow Biome's formatting rules before committing

## Monorepo Structure Rules

1. **Test File Location**
    - Test files should be co-located with their implementation
    - Use `.test.tsx` extension for component tests
    - Use `.test.ts` extension for utility function tests

#### Best Practices
- ✅ Provide clear context and requirements
- ✅ Review and understand all AI-generated code
- ✅ Use consistent patterns that AI can learn from
- ✅ Generate tests alongside implementation
- ❌ Blindly accept AI suggestions without review
- ❌ Let AI make architectural decisions
- ❌ Skip testing AI-generated code
- ❌ Use AI for security-critical logic without thorough review

# Copilot Rules

### Naming Conventions

- **Component Names**: Use clear and descriptive names
- **File Names**: Use clear and descriptive names
- **Folder Names**: Use clear and descriptive names

### Code Quality Standards
- Use **Biome** for formatting and linting (not ESLint/Prettier)
- Follow **YAGNI** and **KISS** principles
- Write self-documenting code with clear TypeScript types
- Co-locate test files with implementation files
- Apply **SOLID principles** for maintainable, testable code
- Use **Dependency Injection** patterns to improve testability

### SOLID Principles for Testability
- **Single Responsibility**: Each component/function has one clear purpose
- **Open/Closed**: Components are open for extension, closed for modification
- **Liskov Substitution**: Abstractions can be replaced with implementations
- **Interface Segregation**: Keep interfaces focused and minimal
- **Dependency Inversion**: Depend on abstractions, not concretions

### Code Writing Principles
- We try to push data fetching as far up in the hierarchy as possible, usually doing data fetching at the very top.
- We usually call these "Root"-components, all components below that root component should take their data as props. 
For good dependency injection
- Never use real language in strings, instead use text keys of the format use.case.primary.secondary.third
- No Contexts in this application. The only exceptions are currently the following: 
- - theming
- - session management


### Test Writing Principles
- Don't use fireEvent instead use userEvent
- Try to avoid using `waitFor` unless absolutely necessary, await instead
- Use `screen` queries instead of `getBy` queries
- always create a createProps() method that returns the props for the component
- call createProps() in each test and then modify the returned props object to fit the test case
- we have a global mock in our test setup that mocks the `useTranslation` hook from `react-i18next`
- all texts in our tests will be the textKey itself use.case.primary.secondary.third 
- test files should be located in the same directory as the component or utility function being tested
- test files should be named .test.tsx, so page.tsx has page.test.tsx


## API Architecture

The frontend follows a strict layered architecture for API integration:

### Data Flow & Type Ownership
1. **API Layer** (`src/external/api/`): Auto-generated DTOs (e.g., `RecipeDto`, `UserDto`) - **NEVER leave this layer**
2. **Domain Models** (`src/models/`): Application-owned types (`User`, `Receipt`, `AuthTokens`) - canonical throughout app
3. **API Handlers** (`src/external/handlers/`): Map DTOs to domain models with explicit types (no `any`, no inference)
4. **Route Types** (`useCase/*/types.ts`): Each route owns its specific data types (`RecipeListItem`, `RecipeDetail`)

### Key Rules
- **No DTO Leakage**: DTOs confined to API layer only
- **Explicit Mappers**: All mappers have declared return types: `const mapUserDtoToUser(dto: UserDto): User`
- **Handler Injection**: Routes receive API handlers as props (dependency injection pattern)
- **Type Safety**: Never use `any` or rely on inference in mappers

### API Handler Pattern
- One handler per use case: `LoginApiHandler`, `RecipeListApiHandler`, `RecipeApiHandler`
- Handlers encapsulate API calls and DTO→domain model mapping
- Route components receive handlers as props from router

### Route-Specific Types
- Each route/use case declares its own data types
- Map from domain models to route-specific needs
- Example: `Receipt` → `RecipeListItem` for list view, `RecipeDetail` for detail view

### Configuration
- API client configured in `src/apiConfig.ts`
- Generate client with `npm run generate-api`
- Set auth tokens via `setAuthToken(token)`
