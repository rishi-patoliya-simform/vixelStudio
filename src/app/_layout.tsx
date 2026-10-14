import { DefaultTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { SplashScreen, Stack, useNavigationContainerRef } from 'expo-router';
import React, { type FC } from 'react';
import { LogBox, StatusBar, Text, TextInput } from 'react-native';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AppEnvConst } from '../constants';
import { useTheme } from '../hooks';
import { AuthSelectors, persistor, store, useAppSelector } from '../redux';
import { Colors } from '../theme';
// Keep splash screen visible until auth state is rehydrated
SplashScreen.preventAutoHideAsync();

/**
 * Disable font scaling globally.
 */
// @ts-ignore
Text.defaultProps = Text.defaultProps || {};
// @ts-ignore
Text.defaultProps.allowFontScaling = false;
// @ts-ignore
TextInput.defaultProps = TextInput.defaultProps || {};
// @ts-ignore
TextInput.defaultProps.allowFontScaling = false;

/**
 * Suppress noisy log warnings.
 */
LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs([
  'EventEmitter.removeListener',
  'Require cycle:',
  'Non-serializable values were found in the navigation state. Check',
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components"
]);

/**
 * The RootNavigator Component
 * Defines the main navigation structure of the app with authentication guards.
 * Utilizes Stack.Protected to conditionally render protected and public route groups
 * based on the user's authentication state.
 * @returns {React.ReactElement} The guarded Stack navigator.
 */
const RootNavigator: FC = (): React.ReactElement => {
  const isLoggedIn = useAppSelector(AuthSelectors.getIsLoggedIn);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(protected)" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(public)" />
      </Stack.Protected>
    </Stack>
  );
};

/**
 * Initializes React Navigation Redux DevTools in development.
 * Kept in a separate component so the hook is never called conditionally.
 */
const NavigationDevTools: FC<{ navigationRef: ReturnType<typeof useNavigationContainerRef> }> = ({
  navigationRef
}): null => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useReduxDevToolsExtension } = require('@react-navigation/devtools');
  useReduxDevToolsExtension(navigationRef);
  return null;
};

/**
 * The ThemedNavigator Component.
 * Wraps the application with a navigationRef from expo-router for imperative navigation & devtools.
 * ThemeProvider that mirrors the app's dark/light Colors to React Navigation.
 * @returns {React.ReactElement}
 */
const ThemedNavigator: FC = (): React.ReactElement => {
  const { theme, isDark } = useTheme();
  const navigationRef = useNavigationContainerRef();

  const navTheme: Theme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors[theme]?.black,
      background: Colors[theme]?.white,
      card: Colors[theme]?.white,
      text: Colors[theme]?.black,
      border: Colors[theme]?.black,
      notification: Colors[theme]?.white
    }
  };

  return (
    <ThemeProvider value={navTheme}>
      {AppEnvConst.isDevelopment && <NavigationDevTools navigationRef={navigationRef} />}
      <StatusBar
        backgroundColor={Colors[theme]?.white}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <RootNavigator />
    </ThemeProvider>
  );
};

/**
 * The Main RootLayout Component.
 * Wraps the application with the necessary providers and the root navigator.
 * @returns {React.ReactElement} The RootLayout component.
 */
const RootLayout: FC = (): React.ReactElement => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemedNavigator />
      </PersistGate>
    </Provider>
  );
};

export default Sentry.wrap(RootLayout);
