import { Redirect, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { ROUTES } from '../constants';
import { AuthSelectors, useAppSelector } from '../redux';
/**
 * The App Component
 * Auth-aware router gate that redirects users based on login state:
 * - Authenticated users → redirected to `/home` (protected tab).
 * - Unauthenticated users → redirected to `/signin` (public auth flow).
 * @returns {React.ReactElement} A Redirect component to the appropriate entry screen.
 */
export default function App(): React.ReactElement {
  const isLoggedIn = useAppSelector(AuthSelectors.getIsLoggedIn);
  /**
   * Hide the splash screen once the component mounts.
   * Ensures the splash screen remains visible until the app is ready to render,
   * preventing any flicker or blank screens during the initial load.
   */
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (isLoggedIn) {
    return <Redirect href={ROUTES.Home} />;
  }

  return <Redirect href={ROUTES.SignIn} />;
}
