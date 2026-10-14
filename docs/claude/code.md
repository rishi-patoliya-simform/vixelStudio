# Code Instructions

All code MUST follow these architectural patterns, file organization, and coding standards.

## Project Architecture Patterns

### MANDATORY Directory Structure

```text
app/
├── modules/          # Feature-based modules (auth, home, details)
│   └── feature-name/
│       ├── FeatureScreen.tsx         # Main screen component
│       ├── FeatureStyles.ts          # Screen-level styles
│       ├── FeatureTypes.ts           # Screen-level types
│       ├── useFeature.ts             # Screen-level custom hook
│       ├── index.ts                  # Barrel export
│       └── components/               # Feature-specific components (optional)
│           ├── SubComponent.tsx
│           ├── SubComponentStyles.ts
│           ├── SubComponentTypes.ts
│           └── index.ts
├── components/       # Reusable UI components
│   └── component-name/
│       ├── ComponentName.tsx
│       ├── ComponentNameStyles.ts
│       ├── ComponentNameTypes.ts
│       └── index.ts
├── navigation/       # Navigation configuration
├── redux/           # Store, reducers, actions
├── hooks/           # Custom hooks (useTheme, usePermission, etc.)
├── services/        # Storage, API configurations
├── utils/           # Common utilities and helpers
├── constants/       # App constants, routes, strings
├── theme/           # Colors, metrics, styles
├── types/           # TypeScript type definitions
├── translations/    # i18n translation files
└── assets/          # Images, icons, fonts
```

## File Naming Conventions

### MANDATORY Naming Patterns

```typescript
// Components & Screens (PascalCase)
HomeScreen.tsx;
CustomButton.tsx;
UserProfile.tsx;

// Styles (PascalCase + "Styles")
HomeScreenStyles.ts;
CustomButtonStyles.ts;
UserProfileStyles.ts;

// Types (PascalCase + "Types")
HomeScreenTypes.ts;
CustomButtonTypes.ts;
UserProfileTypes.ts;

// Hooks (camelCase with "use" prefix)
useAuth.ts;
useTheme.ts;
usePermission.ts;

// Utils (PascalCase + "Utils")
NavigatorUtils.ts;
ValidationUtils.ts;
CommonUtils.ts;

// Constants (PascalCase)
NavigationRoutes.ts;
AppConst.ts;
MMKVKeys.ts;

// Barrel exports (lowercase)
index.ts;
```

### File Organization Rules

1. **One component per file**: Each component gets its own file
2. **Four-file pattern**: Component, Styles, Types, Index for reusable components
3. **Barrel exports**: Every directory must have index.ts
4. **Consistent naming**: Follow PascalCase for components, camelCase for utilities

## Component Architecture

- See [Component Instructions](component.md) for detailed component architecture patterns, including screen structure, and custom hooks.

### MANDATORY Component Placement Decision

**Project-Level Components** (`app/components/`):

- Used by **multiple features** across the project
- Generic, reusable UI components (buttons, inputs, headers, loaders, spinners, etc.)
- Shared across the entire application
- Examples: `CustomButton`, `CustomHeader`, `FullScreenLoader`, `Spinner`

**Feature-Level Components** (`modules/feature-name/components/`):

- Used **only within a single feature**
- Specific to that feature's business logic
- Not reusable by other features
- Created only if the feature needs feature-level components

**🚨 RULE**: If a component is useful for the whole project, add it to `app/components/`. If it's feature-specific only, add it to `modules/feature-name/components/`.

## Module Architecture

### MANDATORY Feature Module Structure

**CORE FILES:**

```text
modules/feature-name/
├── FeatureScreen.tsx         # Main screen component — UI only, no business logic
├── FeatureStyles.ts          # Themed style function
├── FeatureTypes.ts           # Screen props, route params, hook return type, form values
├── useFeature.ts             # All business logic, Redux dispatch, Formik, handlers
└── index.ts                  # Barrel export
```

**OPTIONAL Components Folder (Only if feature needs them):**

```text
modules/feature-name/
└── components/           # Feature-specific components
    ├── Component.tsx
    ├── ComponentStyles.ts
    ├── ComponentTypes.ts
    └── index.ts
```

### MANDATORY Module Rules

1. **Screen components**: UI rendering only. All logic, state, and dispatch live in `useFeature.ts`
2. **Custom hooks**: Must return a typed `FeatureHookReturnType` interface — no implicit `any`
3. **Form handling**: Formik with Yup `validationSchema` inside the hook, not the screen
4. **Redux calls**: All `dispatch()` calls go through `unwrap()` inside `try/catch`
5. **Barrel exports**: `index.ts` at every directory level — no deep relative imports from outside the module
6. **Components** (if needed): Always follow the same 4-file component architecture

See [Component Instructions](component.md) for the full implementation patterns of each file.

## Redux Architecture

- See [Redux Code Instructions](redux.md) for comprehensive Redux architecture patterns, including actions, reducers, selectors, and async thunk.

## Utility Functions

### MANDATORY Utility Structure

```typescript
// utils/FeatureUtils.ts — named exports only, each with a JSDoc comment
import type { InputType, OutputType } from '../types';

/**
 * Brief description of what the function does.
 * @param input - description
 * @returns description
 */
export const functionName = (input: InputType): OutputType => {
  // implementation
};
```

Rules:

- Named exports only — no default export from utility files
- Every exported function must have a JSDoc comment with `@param` and `@returns`
- No `any` types — use proper TypeScript generics or concrete types
- Pure functions preferred — no side effects in utility files

## Code Quality Standards

### MANDATORY Documentation

````typescript
/**
 * Component/Function documentation template
 *
 * Brief description of what this component/function does.
 * Include any important behavior or side effects.
 *
 * Features:
 * - List key features
 * - Include important details
 * - Mention any dependencies
 *
 * @param param1 - Description of parameter
 * @param param2 - Description of parameter
 * @returns Description of return value
 *
 * @example
 * ```typescript
 * const result = myFunction('value1', 'value2');
 * ```
 */
````

### MANDATORY Error Handling

```typescript
// REQUIRED: Comprehensive error handling
const handleAsyncOperation = async () => {
  try {
    const result = await someAsyncOperation();
    return result;
  } catch (error) {
    console.error('Operation failed:', error);
    if (error instanceof NetworkError) {
      // Handle network errors
    } else if (error instanceof ValidationError) {
      // Handle validation errors
    }
    throw error; // Re-throw if needed
  }
};

// REQUIRED: Defensive programming — prefer optional chaining
const safeValue = value?.nested ?? defaultValue;
```

### MANDATORY Performance Optimization

See [Performance Instructions](performance.md) for all memoization (`useMemo`, `useCallback`, `React.memo`), list optimization, and animation patterns.

## Import/Export Organization

### MANDATORY Import Order

```typescript
// 1. React and React Native imports
import React, { useCallback, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';

// 2. Third-party library imports
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';

// 3. Project hooks (closest to React imports)
import { useTheme, usePermission } from '../../hooks';

// 4. Project constants and utilities
import { Strings, ROUTES } from '../../constants';
import { NavigatorUtils, ValidationUtils } from '../../utils';

// 5. Project services and API
import { APIService, Storage } from '../../services';

// 6. Redux imports
import { useAppSelector, useAppDispatch, FeatureActions, FeatureSelectors } from '../../redux';

// 7. Component imports (local first, then global)
import SubComponent from './components/SubComponent';
import { CustomButton, CustomHeader } from '../../components';

// 8. Type imports (grouped at end)
import type { ComponentProps, RouteParams } from './ComponentTypes';
import type { RootState } from '../../redux/types';
```

### MANDATORY Export Patterns

```typescript
// Default export for main component
export default ComponentName;

// Named exports for additional items
export { ComponentUtils } from './ComponentUtils';
export type { ComponentProps, ComponentVariant, ComponentConfig } from './ComponentTypes';

// Barrel exports in index.ts
export { default } from './ComponentName';
export { ComponentUtils } from './ComponentUtils';
export type * from './ComponentTypes';
```