import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { type FC } from 'react';
import { useTheme } from '../../../hooks';
import { Colors, scale } from '../../../theme';

/** Type definition for tab bar icon components. */
interface TabIconProps {
  color: string;
  focused: boolean;
}

/**
 * The HomeTabIcon Component
 * Renders the Home tab icon — uses a filled icon when the tab is focused
 * and an outline variant when inactive.
 * @param {TabIconProps} props - Icon color and focused state.
 * @returns {React.ReactElement} The Home tab icon.
 */
const HomeTabIcon = ({ color, focused }: TabIconProps): React.ReactElement => (
  <Ionicons name={focused ? 'home' : 'home-outline'} size={scale(22)} color={color} />
);

/**
 * The ProfileTabIcon Component
 * Renders the Profile tab icon — uses a filled icon when the tab is focused
 * and an outline variant when inactive.
 * @param {TabIconProps} props - Icon color and focused state.
 * @returns {React.ReactElement} The Profile tab icon.
 */
const ProfileTabIcon = ({ color, focused }: TabIconProps): React.ReactElement => (
  <Ionicons name={focused ? 'person' : 'person-outline'} size={scale(22)} color={color} />
);

/**
 * The TabsLayout Component
 * Defines the tab navigation structure for authenticated users.
 * Contains Home and Profile tabs with themed styling.
 * @returns {React.ReactElement} The TabsLayout component.
 */
const TabsLayout: FC = (): React.ReactElement => {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTintColor: Colors[theme]?.black,
        headerStyle: {
          backgroundColor: Colors[theme]?.white
        },
        headerTitleStyle: {
          color: Colors[theme]?.black,
          fontSize: scale(18)
        },
        tabBarActiveTintColor: Colors[theme]?.black,
        tabBarInactiveTintColor: Colors[theme]?.gray,
        tabBarStyle: {
          backgroundColor: Colors[theme]?.white,
          borderTopColor: Colors[theme]?.gray,
          paddingBottom: scale(4),
          paddingTop: scale(4)
        },
        tabBarLabelStyle: {
          fontSize: scale(11)
        }
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          headerTitle: 'Home',
          tabBarIcon: HomeTabIcon
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          headerTitle: 'Profile',
          tabBarIcon: ProfileTabIcon
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
