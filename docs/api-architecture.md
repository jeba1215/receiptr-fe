# OpenAPI TypeScript Axios Client Implementation

## Overview

This implementation follows SOLID principles with a layered architecture that ensures separation of concerns and maintainability.

## Architecture Layers

### 1. Generated API Layer (`src/external/api/`)
- **Purpose**: Contains auto-generated TypeScript types and Axios service methods
- **Generated from**: OpenAPI spec at `http://localhost:8086/v3/api-docs`
- **Rule**: DTO types (e.g., `RecipeDto`, `UserDto`) **NEVER** leave this layer

### 2. Internal Domain Models (`src/models/`)
- **Purpose**: Application-owned domain types that represent business entities
- **Examples**: `User`, `Receipt`, `AuthTokens`
- **Rule**: These are the canonical types used throughout the application

### 3. API Handlers (`src/external/handlers/`)
- **Purpose**: Encapsulate API operations and map DTOs to domain models
- **Examples**: `LoginApiHandler`, `RecipeListApiHandler`, `RecipeApiHandler`
- **Mapping**: Each handler includes explicit mappers like `mapUserDtoToUser()`

### 4. Route-Specific Types (`useCase/*/types.ts`)
- **Purpose**: Each route/use case owns its specific data types
- **Examples**: `RecipeListItem`, `RecipeDetail`
- **Mapping**: Maps from domain models to route-specific needs

## Data Flow

```
API (DTOs) → API Handlers (Domain Models) → Routes (Route-Specific Types) → Components
```

1. **API Layer**: Returns DTOs like `ReceiptResponse`
2. **API Handlers**: Map to domain models like `Receipt`
3. **Routes**: Map to route-specific types like `RecipeListItem`
4. **Components**: Receive route-specific types via props

## Key Principles

### 1. **No DTO Leakage**
- DTO types (`RecipeDto`, `UserDto`) are confined to `src/external/api/`
- All mappers have explicit return types: `const mapUserDtoToUser(dto: UserDto): User`

### 2. **Handler Dependency Injection**
- Each route receives its API handler as a prop
- Router passes handlers to route components
- Business logic components remain unaware of data fetching

### 3. **Type Safety**
- No `any` types or type inference in mappers
- Explicit type definitions throughout the chain
- Runtime validation in mappers for required fields

### 4. **Single Responsibility**
- One API handler per use case/route
- Dedicated mappers for each transformation
- Clear separation between API operations and business logic

## Usage

### Generate API Client
```bash
npm run generate-api
```

### Using API Handlers in Routes
```typescript
// In router
const recipeListApiHandler = new RecipeListApiHandler();

// Pass to route
<RecipeListRoot recipeListApiHandler={recipeListApiHandler} />
```

### Example Handler Usage
```typescript
// API Handler maps DTO to domain model
const receipts = await recipeListApiHandler.getAllReceipts(); // Returns Receipt[]

// Route maps domain model to route-specific type
const recipeItems = receipts.map(mapReceiptToRecipeListItem); // Returns RecipeListItem[]
```

## Files Generated

- **API Client**: `src/external/api/` (auto-generated)
- **Domain Models**: `src/models/User.ts`, `src/models/Receipt.ts`, etc.
- **API Handlers**: `src/external/handlers/loginApiHandler.ts`, etc.
- **Route Types**: `useCase/*/types.ts`
- **Route Mappers**: `useCase/*/mappers.ts`

## Configuration

API base URL and authentication are configured in `src/apiConfig.ts`:

```typescript
import { setAuthToken } from './src/apiConfig';

// Set JWT token for authenticated requests
setAuthToken('your-jwt-token');
```
