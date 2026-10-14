# Redux Instructions

Use Redux Toolkit + async thunks with cancellation + typed hooks/selectors + MMKV-backed persistence.

## Store Configuration (Required)

```typescript
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'redux-storage', encryptionKey });

const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => Promise.resolve(storage.getString(key)),
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  }
};

const persistConfig = {
  key: 'root',
  storage: mmkvStorage,
  whitelist: ['feature']
};

const rootReducer = combineReducers({
  feature: FeatureReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }),
  devTools: __DEV__
});

export const persistor = persistStore(store);
export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;
```

## Typed Hooks (Required)

```typescript
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootStateType, AppDispatchType } from './Store';

export const useAppDispatch = (): AppDispatchType => useDispatch<AppDispatchType>();
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector;
```

## Slice Structure (Required)

Each slice folder must include:

```text
redux/feature/
├── FeatureInitial.ts
├── FeatureSlice.ts
├── FeatureSelectors.ts
└── index.ts
```

## Initial State (`FeatureInitial.ts`)

### MANDATORY Initial State Structure

- Export `interface FeatureStateType` — every field documented with an inline JSDoc comment
- Always include: `loading`, `error`
- Export `INITIAL_STATE` as default
- No `any` types
- **State fields are task-dependent**: `data` is only an example key. Define state fields and their types based on what your slice actually needs to store (e.g. `user`, `token`, `items`, `profile`). The field name and type both depend on the task.

```typescript
import type { FeatureData, ErrorResponse } from '../../types'; // Replace FeatureData with your actual stored type

// REQUIRED: State interface definition with JSDoc
export interface FeatureStateType {
  data: FeatureData | null; // 'data' is an example — rename the field and its type to match what this slice stores
  loading: boolean;
  error: ErrorResponse | null;
  lastUpdated: number | null;
}

// REQUIRED: Initial state definition
const INITIAL_STATE: FeatureStateType = {
  data: null, // rename to match your state field
  loading: false,
  error: null,
  lastUpdated: null // Vary based on task to task
};

export default INITIAL_STATE;
```

## Slice (`FeatureSlice.ts`)

### MANDATORY Rules

- Use `createAsyncThunkWithCancelToken` — never plain `createAsyncThunk`
- JSDoc required on every exported thunk
- All `pending/fulfilled/rejected` cases must be explicit
- Expose at least `clearError` and `resetState` in synchronous reducers
- Keep all state mutations and payloads strictly typed with `Draft<FeatureStateType>` and `PayloadAction<T>`
- Export `FeatureActions` (spread slice.actions + thunks) and `FeatureReducer`

```typescript
import {
  createSlice,
  type ActionReducerMapBuilder,
  type Draft,
  type PayloadAction
} from '@reduxjs/toolkit';
import { APIConst, ToolkitAction } from '../../constants';
import { authorizedAPI } from '../../configs';
import { createAsyncThunkWithCancelToken } from '../../configs/APIConfig';
import type { FeatureResponse, ErrorResponse } from '../../types';
import INITIAL_STATE, { type FeatureStateType } from './FeatureInitial';

// REQUIRED: Async thunks for unauthorized API calls with JSDoc
export const fetchFeatureData = createAsyncThunkWithCancelToken<FeatureResponse>(
  ToolkitAction.fetchFeatureData,
  'GET',
  APIConst.featureData,
  FeatureResponse,
  authorizedAPI
);

// REQUIRED: Slice definition with JSDoc
const featureSlice = createSlice({
  name: 'feature',
  initialState: INITIAL_STATE,
  reducers: {
    clearError: (state: Draft<FeatureStateType>) => {
      state.error = null;
    },
    resetState: () => INITIAL_STATE
  },
  extraReducers: (builder: ActionReducerMapBuilder<FeatureStateType>) => {
    builder
      .addCase(fetchFeatureData.pending, (state: Draft<FeatureStateType>) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFeatureData.fulfilled,
        (state: Draft<FeatureStateType>, action: PayloadAction<FeatureResponse>) => {
          state.loading = false;
          // Map the API response to the stored data shape.
          // If FeatureData === FeatureResponse, assign directly.
          // If FeatureData is a subset of fields, extract only the needed fields here.
          state.data = action.payload;
          state.lastUpdated = Date.now();
        }
      )
      .addCase(
        fetchFeatureData.rejected,
        (state: Draft<FeatureStateType>, action: PayloadAction<ErrorResponse>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  }
});

export const FeatureActions = {
  ...featureSlice.actions,
  fetchFeatureData
};
export const FeatureReducer = featureSlice.reducer;
```

## Selectors (`FeatureSelectors.ts`)

### MANDATORY Selector Structure

- Define a typed `FeatureSelectorsType` interface and implement it as a const object
- Select narrow slices (`loading`, `error`, specific data) — never select the whole subtree
- Use `createSelector` when deriving computed/filtered data
- Export selectors object as default

```typescript
import type { RootStateType } from '../Store';
import type { FeatureStateType } from './FeatureInitial';
import type { FeatureData, ErrorResponse } from '../../types';

// REQUIRED: Selector interface definition with JSDoc
interface FeatureSelectorsType {
  getFeature: (state: RootStateType) => FeatureStateType;
  getLoading: (state: RootStateType) => boolean;
  getError: (state: RootStateType) => ErrorResponse | undefined;
  getData: (state: RootStateType) => FeatureData | null;
}

// REQUIRED: Selector implementations with JSDoc
const FeatureSelectors: FeatureSelectorsType = {
  getFeature: (state) => state.feature,
  getLoading: (state) => state.feature.loading,
  getError: (state) => state.feature?.error || undefined,
  getData: (state) => state.feature.data
};

export default FeatureSelectors;
```

## Barrel Export (`index.ts`)

```typescript
export { default as FeatureSelectors } from './FeatureSelectors';
export { FeatureActions, FeatureReducer } from './FeatureSlice';
```

## Component/Hook Integration Pattern

Business logic belongs in feature hooks (`useFeature.ts`), not screen components.

```typescript
const handleSubmit = useCallback(
  async (payload: RequestType) => {
    try {
      dispatch(FeatureActions.clearError());
      await dispatch(FeatureActions.fetchFeatureData(payload)).unwrap();
      navigateWithParam(ROUTES.Home);
    } catch {
      // Error state is handled by rejected case in slice
    }
  },
  [dispatch]
);

useEffect(() => () => dispatch(FeatureActions.clearError()), [dispatch]);
```

## Forbidden Patterns

- ❌ Raw `useDispatch` / `useSelector` in app code.
- ❌ Plain string action dispatch (`{ type: 'X' }`) for async API flows.
- ❌ API calls directly in components/screens.
- ❌ Unhandled async thunk rejections (missing `.unwrap()` handling).
