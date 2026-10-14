# Navigation Instructions

Use typed routes + centralized navigator utilities for all navigation actions.

## Route Typing (Required)

```typescript
// constants/NavigationRoutes.ts
export enum ROUTES {
  SignIn = 'SignIn',
  SignUp = 'SignUp',
  Details = 'Details',
  /// ... project-specific routes
}

export type RootStackParamList = {
  [ROUTES.SignIn]: undefined;
  [ROUTES.SignUp]: undefined;
  [ROUTES.Details]: { id: string; title?: string };
  /// ... project-specific routes
};
```

## Navigator Utils

Use shared helpers from `utils/NavigatorUtils.ts` for all navigation actions. Do not use the `useNavigation` hook for methods like `push`, `pop`, or similar actions. Reuse the existing helpers whenever possible, and only add new utilities when a reusable global helper is genuinely needed. The `useNavigation` hook may still be used for cases that cannot be handled through the shared utilities.

## Screen Integration Pattern

```typescript
import React, { useCallback, useLayoutEffect } from 'react';
import { Image, Pressable } from 'react-native';
import { useNavigation, useRoute, useFocusEffect, type RouteProp } from '@react-navigation/native';
import { Icons } from '../../assets';
import { ROUTES, Strings } from '../../constants';
import { navigateBack, navigateWithParam } from '../../utils';
import type { RootStackParamList } from '../../navigation';

type DetailsRoute = RouteProp<RootStackParamList, ROUTES.Details>;

const DetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<DetailsRoute>();
  const { id } = route.params;

  useFocusEffect(
    useCallback(() => {
      // start focused work
      return () => {
        // cleanup on blur
      };
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: Strings.Details.screenTitle,
      headerLeft: () => (
        <Pressable onPress={() => navigateBack()}>
          <Image source={Icons.backArrow} accessibilityRole="image" />
        </Pressable>
      ),
    });
  }, [navigation]);

  const goProfile = useCallback(() => {
    navigateWithParam(ROUTES.Profile, { userId: id });
  }, [id]);

  return null;
};
```

## Deep Linking

Required in `NavigationContainer`:

- `prefixes` for app scheme + universal links
- `config.screens` mapped to `ROUTES`
- `getInitialURL` and `subscribe` handlers

Deep link parsing utilities should:

1. Parse URL safely.
2. Validate required params.
3. Route using navigator utils.
4. Fail gracefully with logs.

## Auth & Route Guards

- Derive auth state from Redux (`state.auth.isAuthenticated`).
- Decide initial stack (`AuthStack` vs `MainStack`) in `AppNavigation.tsx`.
- Perform guard redirects in `useEffect` / `useFocusEffect`, not in render.

## Optional Drawer/Tab Patterns

Only add drawer/tab actions if that navigator exists in the project; default boilerplate is native stack.

## Forbidden Patterns

- ❌ `navigation.navigate('SomeStringRoute')` with untyped string literals.
- ❌ Direct navigation calls scattered in feature logic when utils exist.
- ❌ Route guards executed during render.
- ❌ Deep links handled without param validation.