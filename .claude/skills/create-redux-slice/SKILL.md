---
name: create-redux-slice
description: "Use when adding a new Redux slice to the project. Scaffolds the 4-file Redux structure (Initial, Slice, Selectors, index) using Redux Toolkit with createAsyncThunkWithCancelToken for async API calls. Invoke with /create-redux-slice <SliceName>."
argument-hint: "<SliceName> — PascalCase name (e.g. Auth, UserProfile, Orders)"
---

# Create Redux Slice

Scaffold a complete Redux slice under `app/redux/` following the mandatory Redux architecture for the **Thunk project**.

> **Thunk project only**: This project uses Redux Toolkit async thunks via `createAsyncThunkWithCancelToken`. Do NOT use plain `createAsyncThunk`.

## Invocation

`/create-redux-slice <SliceName>`

- `<SliceName>` — PascalCase name (e.g. `Auth`, `UserProfile`, `Orders`).

## Step-by-step procedure

Follow every step **in order**.

### 1. Validate the slice name

- Must be PascalCase
- Must not duplicate an existing slice in `app/redux/`
- The `createSlice` `name` field uses camelCase: `UserProfile` → `'userProfile'`
- The Redux state key uses camelCase: `userProfile: UserProfileReducer`

### 2. Determine the target directory

```
app/redux/<sliceName-kebab>/
```

e.g. `app/redux/user-profile/`

### 3. Create `<SliceName>Initial.ts`

> **Note**: `data` is just an example field name. Both the key name and its type depend on the task — name your state fields to reflect what they actually store (e.g. `user`, `token`, `orderList`) and define their types accordingly. The structure below is a template; adapt field names and types to your specific use case.

```typescript
import type { <SliceName>Data, ErrorResponse } from '../../types'; // Replace <SliceName>Data with your actual type

export interface <SliceName>StateType {
  data: <SliceName>Data | null; // 'data' is an example key — rename and type to match what you store
  loading: boolean;
  error: ErrorResponse | null;
  lastUpdated: number | null;
}

const INITIAL_STATE: <SliceName>StateType = {
  data: null, // rename to match your state field
  loading: false,
  error: null,
  lastUpdated: null
};

export default INITIAL_STATE;
```

### 4. Create `<SliceName>Slice.ts`

Required imports:

- `createSlice`, `createAsyncThunk`-related types from `@reduxjs/toolkit`
- **`createAsyncThunkWithCancelToken`** from `../../configs/APIConfig` — **not** plain `createAsyncThunk`
- `APIConst`, `ToolkitAction` from `../../constants`
- `authorizedAPI` or `unauthorizedAPI` from `../../configs`
- `INITIAL_STATE` and `<SliceName>StateType` from `./<SliceName>Initial`

Create thunk functions for all asynchronous operations (such as data fetching, authentication, etc.) using the provided template. Ensure the appropriate API configuration is used for each endpoint — authorized APIs for protected routes and unauthorized APIs for public endpoints.

```typescript
// Use unauthorizedAPI for public endpoints (login, register, etc.)
export const fetch<SliceName>Data = createAsyncThunkWithCancelToken<ResponseType>(
  ToolkitAction.<actionKey>,
  'POST',
  APIConst.<endpoint>,
  ResponseClass,
  unauthorizedAPI   // or authorizedAPI — choose based on the endpoint's auth requirement
);
```

Scaffold the full slice file:

```typescript
import { createSlice, type ActionReducerMapBuilder, type Draft, type PayloadAction } from '@reduxjs/toolkit';
import { APIConst, ToolkitAction } from '../../constants';
import { authorizedAPI, unauthorizedAPI } from '../../configs';
import { createAsyncThunkWithCancelToken } from '../../configs/APIConfig';
import type { <SliceName>Response, ErrorResponse } from '../../types';
import INITIAL_STATE, { type <SliceName>StateType } from './<SliceName>Initial';

// Unauthorized thunk (e.g. login, register)
export const fetch<SliceName>Data = createAsyncThunkWithCancelToken<
  <SliceName>Response
>(
  ToolkitAction.<actionKey>,
  'POST',
  APIConst.<endpoint>,
  <SliceName>Response,
  unauthorizedAPI
);

// Authorized thunk (e.g. profile fetch, data load)
export const fetchAuth<SliceName>Data = createAsyncThunkWithCancelToken<
  <SliceName>Response
>(
  ToolkitAction.<actionKey>,
  'GET',
  APIConst.<endpoint>,
  <SliceName>Response,
  authorizedAPI
);

const <sliceName>Slice = createSlice({
  name: '<sliceName>',
  initialState: INITIAL_STATE,
  reducers: {
    clearError: (state: Draft<<SliceName>StateType>) => {
      state.error = null;
    },
    resetState: () => INITIAL_STATE
  },
  extraReducers: (builder: ActionReducerMapBuilder<<SliceName>StateType>) => {
    builder
      .addCase(fetch<SliceName>Data.pending, (state: Draft<<SliceName>StateType>) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetch<SliceName>Data.fulfilled,
        (state: Draft<<SliceName>StateType>, action: PayloadAction<<SliceName>Response>) => {
          state.loading = false;
          // If <SliceName>Data === <SliceName>Response, assign directly.
          // If <SliceName>Data is a subset of fields, extract only the needed fields here.
          state.data = action.payload;
          state.lastUpdated = Date.now();
        }
      )
      .addCase(
        fetch<SliceName>Data.rejected,
        (state: Draft<<SliceName>StateType>, action: PayloadAction<ErrorResponse>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    builder
      .addCase(fetchAuth<SliceName>Data.pending, (state: Draft<<SliceName>StateType>) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAuth<SliceName>Data.fulfilled,
        (state: Draft<<SliceName>StateType>, action: PayloadAction<<SliceName>Response>) => {
          state.loading = false;
          // If <SliceName>Data === <SliceName>Response, assign directly.
          // If <SliceName>Data is a subset of fields, extract only the needed fields here.
          state.data = action.payload;
          state.lastUpdated = Date.now();
        }
      )
      .addCase(
        fetchAuth<SliceName>Data.rejected,
        (state: Draft<<SliceName>StateType>, action: PayloadAction<ErrorResponse>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  }
});

export const <SliceName>Actions = {
  ...<sliceName>Slice.actions,
  fetch<SliceName>Data,
  fetchAuth<SliceName>Data
};
export const <SliceName>Reducer = <sliceName>Slice.reducer;
```

### 5. Create `<SliceName>Selectors.ts`

```typescript
import type { RootStateType } from '../Store';
import type { <SliceName>StateType } from './<SliceName>Initial';
import type { <SliceName>Data, ErrorResponse } from '../../types';

interface <SliceName>SelectorsType {
  get<SliceName>: (state: RootStateType) => <SliceName>StateType;
  getLoading: (state: RootStateType) => boolean;
  getError: (state: RootStateType) => ErrorResponse | undefined;
  getData: (state: RootStateType) => <SliceName>Data | null;
}

const <SliceName>Selectors: <SliceName>SelectorsType = {
  get<SliceName>: (state) => state.<sliceName>,
  getLoading: (state) => state.<sliceName>.loading,
  getError: (state) => state.<sliceName>?.error || undefined,
  getData: (state) => state.<sliceName>.data
};

export default <SliceName>Selectors;
```

### 6. Create `index.ts` (slice barrel)

```typescript
export { default as <SliceName>Selectors } from './<SliceName>Selectors';
export { <SliceName>Actions, <SliceName>Reducer } from './<SliceName>Slice';
```

### 7. Wire into existing project files

**`app/redux/Store.ts`** — add `<sliceName>: <SliceName>Reducer` to `combineReducers`

**`app/redux/index.ts`** — add barrel exports for Actions, Selectors, Reducer

**`app/constants/ToolkitAction.ts`** — add action key constant
