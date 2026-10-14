---
name: review-code
description: "Use when reviewing code or a pull request in the React Native project. Runs through the complete review checklist covering architecture, code quality, typing, performance, security, accessibility, and state management compliance. Invoke with /review-code or point to a file."
argument-hint: "<file-or-description> — optional, reviews current file if omitted"
---

# Review Code

Perform a comprehensive code review against this project's mandatory standards.

## Invocation

`/review-code [<file-or-description>]`

- Called with no argument: reviews currently open/selected file(s)
- Called with a file path: reviews that specific file
- Called with a PR description or diff: reviews the described changes

## Step-by-step procedure

Work through every checklist section in order. Report issues grouped by category. Flag `REJECT` issues (must-fix) separately from `WARN` issues (should-fix).

---

### Pre-review gate

Before starting the review, verify:

- [ ] All automated tests pass
- [ ] ESLint passes without errors or warnings
- [ ] TypeScript compilation succeeds with no errors
- [ ] SonarCloud rules are not violated
- [ ] CSpell passes (no spelling errors)

If any gate fails, record it in the review output and continue with the architectural review. Only skip a specific check when the required command, environment, or tooling is unavailable.

---

### Load relevant docs

Before evaluating each section, read the authoritative doc file for that area. Do not rely on memory — read the file first.

| Review section | Doc file(s) to read |
| --- | --- |
| 1. Architecture & Code Quality | `docs/claude/code.md`, `docs/claude/component.md` |
| 2. Theme & Styling | `docs/claude/theme.md`, `docs/claude/color.md` |
| 3. TypeScript Compliance | `docs/claude/code.md` |
| 4. Strings & Static Data | `docs/claude/strings.md`, `docs/claude/static-data.md` |
| 5. Redux State Management | `docs/claude/redux.md` |
| 6. Navigation | `docs/claude/navigation.md` |
| 7. Performance | `docs/claude/performance.md` |
| 8. Security & Input Handling | `docs/claude/code.md`, `docs/claude/redux.md` |
| 9. Accessibility | `docs/claude/component.md`, `docs/claude/assets.md` |
| 10–12. Code Quality, Imports, Docs | `docs/claude/code.md` |

---

### 1. Architecture & Code Quality

**✅ REQUIRED — reject if violated:**

- [ ] Components follow the 4-file architecture: `Component.tsx`, `ComponentStyles.ts`, `ComponentTypes.ts`, `index.ts`
- [ ] All Redux slices follow: `Initial.ts`, `Slice.ts`, `Selectors.ts`, `index.ts`
- [ ] Feature modules follow: `Screen.tsx`, `Styles.ts`, `Types.ts`, `useFeature.ts`, `index.ts`; optional `components/` subfolder only when sub-components are needed
- [ ] All async API calls use `createAsyncThunkWithCancelToken` — never plain `createAsyncThunk` or direct `fetch`/`axios`
- [ ] Business logic lives in custom hooks, not directly in screen components
- [ ] No web-specific elements (`div`, `span`, `onClick`) in React Native code

---

### 2. Theme & Styling

**✅ REQUIRED — reject if violated:**

- [ ] Every component uses `useTheme(styleSheet)` — no raw `StyleSheet.create` outside a `styleSheet` function
- [ ] All colors accessed via `Colors[theme]?.colorName` — no hardcoded hex values anywhere
- [ ] All numeric dimensions use `scale(value)` — no hardcoded numbers for sizes, padding, margin, border radius
- [ ] Platform differences handled via `globalMetrics.isAndroid` / `globalMetrics.isIos`
- [ ] `...ApplicationStyles(theme)` spread in every `styleSheet` function

---

### 3. TypeScript Compliance

**✅ REQUIRED — reject if violated:**

- [ ] No `any` types anywhere in the codebase
- [ ] All interfaces use PascalCase; all properties use camelCase
- [ ] Optional properties correctly marked with `?`
- [ ] Data structures use `interface`, not `class`
- [ ] `import type` used for type-only imports
- [ ] No missing return types on public functions
- [ ] Generic interfaces used where appropriate (`ApiResponse<T>`, etc.)

---

### 4. Strings & Static Data

**✅ REQUIRED — reject if violated:**

- [ ] No hardcoded user-facing strings in components — all strings use `Strings.Module.key`
- [ ] No direct `I18n.t()` calls in components — only in `constants/Strings.ts`
- [ ] All static arrays, config objects, and enums live in `constants/` or a dedicated static data file
- [ ] Constants use `as const` for immutability
- [ ] No magic numbers or magic strings inline in logic — all extracted to named constants

---

### 5. Redux State Management

**✅ REQUIRED — reject if violated:**

- [ ] `useAppSelector` and `useAppDispatch` used — never raw `useSelector`/`useDispatch`
- [ ] Specific selectors used — never `useAppSelector(state => state)` or selecting the entire slice
- [ ] Errors cleared on component unmount via `dispatch(Actions.clearError())`
- [ ] Loading and error states handled and reflected in UI
- [ ] All async API work uses `createAsyncThunkWithCancelToken` — never plain `createAsyncThunk`
- [ ] `.unwrap()` used on dispatched thunks with proper `try/catch` error handling

---

### 6. Navigation

**✅ REQUIRED — reject if violated:**

- [ ] All routes use `ROUTES` enum constants — no string literals in `navigate()` calls
- [ ] Route parameters typed via `RootStackParamList`
- [ ] Navigation functions from `NavigatorUtils` used — not `navigation.navigate()` directly in most cases
- [ ] Navigation parameters validated before use

---

### 7. Performance

**⚠️ WARN if not applied in performance-sensitive paths:**

- [ ] `React.memo` wrapping expensive components
- [ ] `useCallback` on all event handler props passed to children
- [ ] `useMemo` for expensive derived calculations
- [ ] `useNativeDriver: true` on all `Animated` calls
- [ ] FlatList configured with `removeClippedSubviews`, `maxToRenderPerBatch`, `keyExtractor`
- [ ] `useEffect` cleanup functions present for timers, subscriptions, and async ops

---

### 8. Security & Input Handling

**✅ REQUIRED — reject if violated:**

- [ ] All form inputs validated with Yup schemas
- [ ] No sensitive data (tokens, passwords, PII) in `console.log` or error messages
- [ ] Sensitive data stored in MMKV with encryption — not AsyncStorage or plain storage
- [ ] API responses validated before use
- [ ] No hardcoded credentials, tokens, or secrets in code

---

### 9. Accessibility

**⚠️ WARN if missing on interactive elements:**

- [ ] `accessibilityRole` on all interactive elements
- [ ] `accessibilityLabel` descriptive and meaningful
- [ ] `accessibilityHint` for non-obvious actions
- [ ] `accessibilityState` for elements with state (disabled, selected, checked)
- [ ] `testID` on all interactive and testable elements
- [ ] Touch targets meet minimum size (at least `scale(44)`)

---

### 10. Code Quality (SonarLint)

**✅ REQUIRED — reject if violated:**

- [ ] No potential null pointer exceptions — proper `?.` optional chaining and null checks
- [ ] No duplicate code blocks — DRY principle enforced
- [ ] No magic numbers — all constants named and extracted
- [ ] Functions have reasonable complexity — avoid deeply nested conditionals (max 3 levels)
- [ ] All async operations have `try/catch` error handling
- [ ] No ignored promise rejections (`await` or `.catch()` on all promises)
- [ ] Variables properly scoped — no `var`, use `const`/`let`

---

### 11. Import Organization

**⚠️ WARN if not followed:**

Order must be:

1. React & React Native imports
2. Third-party library imports
3. Project hooks (`../../hooks`)
4. Project constants and utilities
5. Redux imports
6. Component imports
7. Type imports (grouped at end)

---

### 12. Documentation

**⚠️ WARN if missing:**

- [ ] Public functions and complex logic have JSDoc comments
- [ ] Component files have a JSDoc block describing purpose and features
- [ ] Non-obvious code has inline comments

---

## Reporting format

Group findings by category. Use this format:

```
## Review Result

### REJECT (must fix before merge)
- [Category] Description of issue — file:line

### WARN (should fix, non-blocking)
- [Category] Description of issue — file:line

### PASS
- List categories with no issues found
```

If no issues are found, state: `✅ All checks passed. Ready to merge.`
