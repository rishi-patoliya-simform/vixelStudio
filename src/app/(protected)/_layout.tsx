import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { type FC } from 'react';
import { Pressable } from 'react-native';
import { useTheme } from '../../hooks';
import { Colors, scale } from '../../theme';
import { navigateBack } from '../../utils';

/**
 * The DetailsHeaderLeft Component
 * Renders a back chevron button for the Details screen navigation header.
 * Uses Ionicons for consistent iconography and supports dynamic tint color.
 * @param {object} props - Component props.
 * @param {string} [props.tintColor] - The tint color applied to the icon.
 * @returns {React.ReactElement} A pressable back navigation button.
 */
const DetailsHeaderLeft = ({ tintColor }: { tintColor?: string }): React.ReactElement => (
  <Pressable hitSlop={8} onPress={navigateBack}>
    <Ionicons name="chevron-back" size={scale(24)} color={tintColor} />
  </Pressable>
);

/**
 * The ProtectedLayout Component
 * Defines the navigation structure for authenticated users.
 * @returns {React.ReactElement} The ProtectedLayout component.
 */
const ProtectedLayout: FC = (): React.ReactElement => {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTintColor: Colors[theme]?.black,
        headerStyle: {
          backgroundColor: Colors[theme]?.white
        },
        headerTitleStyle: {
          color: Colors[theme]?.black
        },
        contentStyle: {
          backgroundColor: Colors[theme]?.white
        },
        navigationBarColor: Colors[theme]?.white
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="details"
        options={{
          headerShown: true,
          title: 'Details',
          headerTitleAlign: 'center',
          headerLeft: DetailsHeaderLeft,
          headerTitleStyle: {
            color: Colors[theme]?.black,
            fontSize: scale(18)
          }
        }}
      />
    </Stack>
  );
};

export default ProtectedLayout;
