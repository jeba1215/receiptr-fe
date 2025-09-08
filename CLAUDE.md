# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a React Native app built with Expo called "receiptr" - appears to be a recipe management application. The project uses file-based routing with Expo Router and follows a clean architecture pattern with use cases organized in a separate `useCase` directory.

## Development Commands

### Essential Commands
- `npm install` - Install dependencies
- `npm start` or `npx expo start` - Start the development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator  
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests with watch mode
- `npm run reset-project` - Reset to blank project structure

### Testing
- **CRITICAL**: Write tests for ALL features - this is a strict requirement
- Tests are written using Jest and React Native Testing Library
- **Test files MUST be located next to the file they're testing** (e.g., `Recipe.tsx` → `Recipe.test.tsx`)
- **ALWAYS use `render` from `@/src/testHelpers`** instead of React Native Testing Library directly
- Jest configuration is in package.json with expo preset
- Use `npm test` to run tests in watch mode
- Every new use case MUST have corresponding test coverage

### Quality Checks (MANDATORY)
When finishing changes, ALWAYS run these commands to verify code quality:
1. `npm test -- --watchAll=false` - Run all tests
2. `npx tsc --noEmit` - Check TypeScript compilation
3. `npm run lint` - Check code style and linting
All three commands must pass before considering any implementation complete.

## Architecture

### Directory Structure
- `app/` - Main application screens using Expo Router file-based routing
  - `(tabs)/` - Tab-based navigation screens
  - `_layout.tsx` - Root layout configuration
- `useCase/` - Business logic organized by use cases (clean architecture)
  - `recipeList/` - Recipe list feature components
  - `__tests__/` - Test files for use cases
- `assets/` - Static assets (images, fonts)

### Key Patterns
- Use cases are organized in `useCase/` directory with Main.tsx as entry points
- Components export named exports (not default exports) for better tree-shaking
- TypeScript is used throughout with strict mode enabled
- Path alias `@/*` maps to project root for cleaner imports
- Expo Router handles navigation with file-based routing
- **NO index.ts files** - Always import directly from source files, never use index files for imports/exports

### Use Case Architecture (STRICT REQUIREMENTS)
- **NO IMPORTS** between use cases - each use case must be completely isolated
- **NO DEPENDENCIES** between use cases - they should be independent modules
- **ONE APP PATH** per use case - each use case typically maps to a single route
- **ONE RESPONSIBILITY** per use case - each handles a specific business function

#### Use Case Examples:
- `recipeList/` - Display and manage recipe lists (one route)
- `shoppingList/` - Shopping list functionality (one route)
- `recipeView/` - Individual recipe display (one route)
- `ingredientsCRUD/` - Create/Read/Update/Delete ingredients (one route)
- Each use case contains its own components, logic, and tests
- Use cases communicate only through app-level state or navigation

### SOLID Principles & Dependency Injection (STRICT REQUIREMENTS)
- **FOLLOW SOLID PRINCIPLES** throughout the codebase, especially dependency injection
- **DEPENDENCY INJECTION** is critical for testing and managing component dependencies
- **ROOT COMPONENT PATTERN**: External dependencies are injected only at the route's root component
  - Root component is typically named `{useCase}Root` (e.g., `RecipeListRoot`, `ShoppingListRoot`)
  - Root component handles all external dependencies: API methods, native phone methods, global contexts
  - Root component is the ONLY place where external dependencies are consumed
- **PROP PASSING**: All components below the root receive data exclusively through props
  - No direct access to APIs, contexts, or external services in child components
  - All data flows down through props from the root component
  - This enables easy testing by mocking props instead of complex external dependencies

### Tech Stack
- React Native with Expo (v53)
- TypeScript with strict mode
- Expo Router for navigation
- **React Native Paper** - Material Design components (ALWAYS use RNP components instead of custom UI)
- Jest + React Native Testing Library for testing
- ESLint for code quality

### UI Components (STRICT REQUIREMENTS)
- **ALWAYS use React Native Paper components** for UI elements
- Import from `react-native-paper`: `Button`, `Card`, `Text`, `Surface`, `TextInput`, etc.
- **AVOID custom styling** - use RNP props and variants instead
- Only add minimal custom styles when absolutely necessary