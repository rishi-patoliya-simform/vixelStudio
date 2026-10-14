---
name: create-component
description: "Use when creating a new shared reusable UI component. Scaffolds the mandatory 4-file architecture (Component, Styles, Types, index) with theme integration, accessibility props, TypeScript types, and barrel exports. Invoke with /create-component <ComponentName>."
argument-hint: "<ComponentName> — PascalCase name (e.g. AvatarCard, StatusBadge, LoadingButton)"
---

# Create Component

Scaffold a complete shared UI component under `app/components/` following the mandatory 4-file architecture.

## Invocation

`/create-component <ComponentName>`

- `<ComponentName>` — PascalCase name (e.g. `AvatarCard`, `StatusBadge`, `LoadingButton`)

## Step-by-step procedure

Follow every step **in order**.

### 1. Validate the component name

- Must be PascalCase
- Must not duplicate an existing component in `app/components/`
- Derive the kebab-case folder name: `AvatarCard` → `avatar-card/`

### 2. Create `<ComponentName>.tsx`

Required structure:

- Import `React` from `react`
- Import needed RN primitives (`View`, `Text`, `Pressable`, `StyleProp`, etc.)
- Import `useTheme` from `../../hooks`
- Import `Strings` from `../../constants` for any visible text — no hardcoded strings
- Import `styleSheet` from `./<ComponentName>Styles`
- Import `<ComponentName>DefaultProps` and `<ComponentName>Props` from `./<ComponentName>Types`
- Declare `const <ComponentName>: React.FC<<ComponentName>Props> = (props) => { ... }`
- Destructure props with defaults from `<ComponentName>DefaultProps`
- Call `const { styles } = useTheme(styleSheet)`
- Every interactive element must include: `accessibilityRole`, `accessibilityLabel`, `accessibilityState`, `testID`
- `accessibilityHint` required for non-obvious interactions
- At end of file: `export default <ComponentName>` then `<ComponentName>.displayName = '<ComponentName>'`
- Include JSDoc comment describing the component's purpose, features, `@param props`, and `@returns`

### 3. Create `<ComponentName>Styles.ts`

Required structure:

- Import `StyleSheet` from `react-native`
- Import `ApplicationStyles`, `Colors`, `scale`, `globalMetrics`, `ThemeMode` from `../../theme`
- Export `const styleSheet = (theme: ThemeMode, isDark?: boolean) => StyleSheet.create({ ...ApplicationStyles(theme), ... })`
- All colors via `Colors[theme]?.colorName` — no hardcoded hex values
- All dimensions via `scale(value)` — no hardcoded numbers
- Platform differences via `globalMetrics.isAndroid` / `globalMetrics.isIos` / `globalMetrics.isPad`
- Include JSDoc comment describing the style sheet's purpose

### 4. Create `<ComponentName>Types.ts`

Required structure:

- `export interface <ComponentName>Props { ... }` — every prop documented with an inline JSDoc comment
  - Always include: `customStyle?: StyleProp<ViewStyle>`, `testID?: string`, `accessibilityLabel?: string`
- `export const <ComponentName>DefaultProps: Partial<<ComponentName>Props> = { testID: '<component-name>' } as const`
- Additional variant/config types as needed

### 5. Create `index.ts`

```typescript
export { default } from './<ComponentName>';
export type { <ComponentName>Props } from './<ComponentName>Types';
```

### 6. Register the component in the barrel export

Apply this edit directly to `app/components/index.ts`:

- Add `export { default as <ComponentName> } from './<componentName-kebab>';`
- Add `export type { <ComponentName>Props } from './<componentName-kebab>';`
