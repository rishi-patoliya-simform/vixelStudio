import { Stack } from 'expo-router';
import React, { type FC } from 'react';
import { useTheme } from '../../hooks';
import { Colors } from '../../theme';

/**
 * The PublicLayout Component
 * Defines the navigation structure for unauthenticated users.
 * @returns {React.ReactElement} The PublicLayout component.
 */
const PublicLayout: FC = (): React.ReactElement => {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors[theme]?.white
        },
        navigationBarColor: Colors[theme]?.white
      }}
    >
      <Stack.Screen name="signin/index" options={{ title: 'Sign In' }} />
      <Stack.Screen name="signup/index" options={{ title: 'Sign Up' }} />
    </Stack>
  );
};

export default PublicLayout;
