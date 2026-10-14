# vixelStudio — Claude Context

Expo SDK 55 (React Native 0.83.6) / TypeScript project using **Redux Toolkit + async thunks** for state management, React Navigation v6, apisauce, and a theme-based dark/light styling system.

## Architecture

- **State Management**: Redux Toolkit + `createAsyncThunkWithCancelToken` + redux-persist (MMKV)
- **Navigation**: React Navigation v6 (native stack)
- **API Layer**: apisauce + axios (called via `createAsyncThunkWithCancelToken`)
- **Styling**: `useTheme(styleSheet)` hook — all colors via `Colors[theme]?.key`, all dimensions via `scale(value)`

## Directory Structure

```
app/
├── modules/       # Feature screens (Screen, Styles, Types, useHook, index)
├── components/    # Reusable UI components (4-file architecture)
├── navigation/    # Stack navigators + AppNavigation.tsx
├── redux/         # Store, slices (Initial, Slice, Selectors, index)
├── hooks/         # useTheme, usePermission, useHeader, etc.
├── constants/     # NavigationRoutes, Strings, AppConst, APIConst, ToolkitAction, MMKVKeys
├── configs/       # APIConfig (createAsyncThunkWithCancelToken), authorizedAPI, unauthorizedAPI
├── theme/         # Colors, Metrics, ApplicationStyles
├── types/         # TypeScript interfaces (ErrorResponse, etc.)
├── translations/  # en.json + i18n setup
├── utils/         # NavigatorUtils, ValidationSchema, CommonUtils
└── assets/        # SVGs, icons, images, fonts
```

## Commands

| Purpose | Command |
|---------|---------|
| Tests + coverage | `yarn test` |
| Full check (lint+format+types+spelling) | `yarn local-check` |
| Android dev / preview / prod | `yarn android:dev` / `yarn android:preview` / `yarn android:prod` |
| iOS dev / preview / prod | `yarn ios:dev` / `yarn ios:preview` / `yarn ios:prod` |

## Decision Guide

Before implementing, identify ALL applicable categories — tasks often span multiple (e.g., a new screen may also need Assets or Static Data). Read all docs listed for your task type before writing any code.

| Task | Docs to read |
|------|-------------|
| New UI Component | docs/claude/component.md, docs/claude/theme.md, docs/claude/color.md, docs/claude/strings.md, docs/claude/code.md, docs/claude/performance.md |
| New Feature Screen | docs/claude/component.md, docs/claude/theme.md, docs/claude/color.md, docs/claude/strings.md, docs/claude/code.md, docs/claude/navigation.md, docs/claude/redux.md, docs/claude/performance.md |
| Redux Slice / Async Thunk | docs/claude/redux.md, docs/claude/code.md, docs/claude/performance.md |
| Navigation & Routing | docs/claude/navigation.md, docs/claude/code.md |
| Assets & Media | docs/claude/assets.md, docs/claude/code.md |
| Static Data & Constants | docs/claude/static-data.md, docs/claude/code.md |
| API & Services | docs/claude/redux.md, docs/claude/code.md |
| Custom Hook | docs/claude/code.md, docs/claude/performance.md |
| Utility Function | docs/claude/code.md |
| Data Persistence | docs/claude/redux.md, docs/claude/code.md |

## Core Rules

- Follow established module/component/code structure patterns
- Use theme system for all colors, metrics, and responsive design — no hardcoded values
- Use centralized i18n strings — no hardcoded strings in components
- Apply memoization, cleanup, and list optimization patterns
- Strict TypeScript — no `any`, always typed interfaces
- Always use `createAsyncThunkWithCancelToken` — never plain `createAsyncThunk`

## Workflow

1. Identify task type → read all Decision Guide docs for that row
2. Plan architecture per loaded docs
3. Generate code with strict adherence
4. Prefer existing `app/components/` over creating new ones
