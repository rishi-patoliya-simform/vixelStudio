---
name: create-screen
description: "Use when creating a new feature module (screen) in the React Native project. Scaffolds the complete module structure with correct naming, TypeScript types, theme integration, Redux hooks, and barrel exports. Invoke with /create-screen <ModuleName>."
argument-hint: "<ModuleName> — PascalCase name for the feature (e.g. UserProfile, OrderDetails)"
---

# Create Feature Module

Scaffold a complete feature module under `app/modules/` following the mandatory module architecture.

## Invocation

`/create-screen <ModuleName>`

- `<ModuleName>` — PascalCase name for the feature (e.g. `UserProfile`, `OrderDetails`).

## Step-by-step procedure

Follow every step **in order**.

### 0. Determine dependent scaffolding

- If the screen needs a new shared reusable UI element under `app/components/`, first read the `create-component` skill and follow `/create-component <ComponentName>` for that dependency.
- If the screen needs new Redux state, async thunks, selectors, or slice wiring under `app/redux/`, first read the `create-redux-slice` skill and follow `/create-redux-slice <SliceName>` for that dependency.
- After creating any required component or Redux slice, continue with this skill to scaffold and wire the screen module itself.

### 1. Validate the module name

- Must be PascalCase (e.g. `UserProfile`, not `userProfile` or `user-profile`)
- Must not already exist under `app/modules/`
- Derive the kebab-case folder name: `UserProfile` → `user-profile/`
- Derive the camelCase hook name: `UserProfile` → `useUserProfile`

### 2. Create `<ModuleName>Screen.tsx`

Required structure:

- Import `React`, layout primitives (`View`, `ScrollView`) from `react-native`
- Import `useRoute` from `@react-navigation/native`
- Import `useTheme` from `../../hooks`
- Import `CustomHeader` from `../../components`
- Import `Strings` from `../../constants`
- Import `styleSheet` from `./<ModuleName>Styles`
- Import `use<ModuleName>` from `./use<ModuleName>`
- **Do NOT import Redux (dispatch/selectors/actions) in the screen** — all Redux work belongs in `use<ModuleName>.ts`
- Declare `const <ModuleName>Screen: React.FC = () => { ... }`
- Call `const { styles } = useTheme(styleSheet)`
- Call `const { ... } = use<ModuleName>()` for all business logic — no business logic directly in the screen
- Return JSX: `<View style={styles.screen}>` → `<CustomHeader>` → `<ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>`
- `export default <ModuleName>Screen`
- Include JSDoc comment describing the screen's purpose

### 3. Create `<ModuleName>Styles.ts`

Required structure:

- Import `StyleSheet` from `react-native`
- Import `ApplicationStyles`, `Colors`, `scale`, `globalMetrics`, `ThemeMode` from `../../theme`
- Export `const styleSheet = (theme: ThemeMode, isDark?: boolean) => StyleSheet.create({ ...ApplicationStyles(theme), ... })`
- Must include at minimum: `screen`, `scrollView`, `contentContainer` keys
- All colors: `Colors[theme]?.colorName` — no hardcoded hex values
- All dimensions: `scale(value)` — no hardcoded numbers
- Platform differences: `globalMetrics.isAndroid` / `globalMetrics.isIos`

### 4. Create `<ModuleName>Types.ts`

Required structure:

- `export interface <ModuleName>ScreenProps { ... }` — navigation props if needed
- `export type <ModuleName>RouteParams = RouteProp<RootStackParamList, ROUTES.<ModuleName>>`
- `export interface <ModuleName>HookReturnType { ... }` — all state and handlers returned by the custom hook
- Form value interfaces if the module contains a form: `export interface <ModuleName>FormValues { ... }`

### 5. Create `use<ModuleName>.ts`

Required structure:

- Import `useCallback`, `useEffect`, `useState` from `react`
- Import `useFormik` from `formik` if the module has a form
- Import `useAppDispatch`, `useAppSelector`, relevant `Selectors` and `Actions` from `../../redux`
- Import `ValidationSchema` from `../../utils` if using Formik
- Import `type { <ModuleName>HookReturnType }` from `./<ModuleName>Types`
- Declare `const use<ModuleName> = (): <ModuleName>HookReturnType => { ... }`
- Wrap all event handlers in `useCallback`
- Use `useFormik` with `validationSchema` for any form, `onSubmit` dispatches via `dispatch(...).unwrap()`
- Return a typed object matching `<ModuleName>HookReturnType`
- Include JSDoc comment describing the hook's purpose and return value

### 6. Create `index.ts`

```typescript
export { default } from './<ModuleName>Screen';
export type { <ModuleName>ScreenProps } from './<ModuleName>Types';
```

### 7. Wire the module into the existing project files

Apply each of these edits directly to the existing files:

**`app/navigation/AppNavigation.tsx`**

- Import `<ModuleName>Screen` from `../modules/<module-name-kebab>`
- Add a `<Stack.Screen name={ROUTES.<ModuleName>} component={ModuleNameScreen} />` style entry in the appropriate stack, where `ModuleNameScreen` is the imported component reference for your module (for example, `UserProfileScreen`) rather than a JSX element

**`app/constants/NavigationRoutes.ts`**

- Add `<ModuleName> = '<ModuleName>'` to the `ROUTES` enum
- Add `[ROUTES.<ModuleName>]: <ParamType> | undefined` to `RootStackParamList` (use `undefined` if no params, or define the param shape from `<ModuleName>Types.ts`)

**`app/modules/index.ts`**

- Add `export { default as <ModuleName>Screen } from './<module-name-kebab>'`

**`app/translations/en.json`**

- Add a new namespace section `"<moduleName>": { "screenTitle": "<ModuleName>" }` with placeholder strings for all user-visible text in this module

**`app/constants/Strings.ts`**

- Add a `<ModuleName>` frozen strings object with `I18n.t('<moduleName>:...')` keys matching the translation entries above
