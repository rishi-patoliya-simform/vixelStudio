import { router, type Href } from 'expo-router';

/**
 * Type definition for route parameters
 */
type RouteParams = Record<string, string | number | undefined | null | (string | number)[]>;

/**
 * Dismisses screens from the navigation stack.
 * @param {number} [screenCount=1] - The number of screens to dismiss.
 * @param {boolean} [isPopToTop=false] - If true, dismisses all screens back to the first screen in the stack.
 * @returns None
 */
export function navigatePop(screenCount: number = 1, isPopToTop: boolean = false): void {
  if (isPopToTop) {
    router.dismissAll();
  } else {
    router.dismiss(screenCount);
  }
}

/**
 * Navigates back one screen in the navigation history.
 * @returns None
 */
export function navigateBack(): void {
  if (router.canGoBack()) {
    router.back();
  }
}

/**
 * Replace the current screen with a new one, without adding to the navigation stack.
 * @param {string} routeName - The name of the route to navigate to.
 * @param {object} [params] - Optional parameters to pass to the route.
 * @returns None
 */
export function navigateWithReplace(routeName: Href, params?: RouteParams): void {
  router.replace(params ? ({ pathname: routeName as string, params } as Href) : routeName);
}

/**
 * Navigates to a new screen, adding it to the navigation stack.
 * @param {string} routeName - The name of the route to navigate to.
 * @param {object} [params] - Optional parameters to pass to the route.
 * @returns None
 */
export function navigateWithParam(routeName: Href, params?: RouteParams): void {
  router.navigate(params ? ({ pathname: routeName as string, params } as Href) : routeName);
}

/**
 * Navigates to a route by always pushing a new screen onto the stack,
 * even if a screen for that route already exists in the stack.
 * @param {string} routeName - The name of the route to navigate to.
 * @param {object} [params] - Optional parameters to pass to the route.
 * @returns None
 */
export function navigateWithPush(routeName: Href, params?: RouteParams): void {
  router.push(params ? ({ pathname: routeName as string, params } as Href) : routeName);
}

/**
 * Reset the navigation stack to a single screen.
 * In Expo Router: dismissAll() clears the stack, then replace() sets the new root.
 */
export function navigateWithReset(routeName: Href, params?: RouteParams): void {
  router.dismissAll();
  router.replace(params ? ({ pathname: routeName as string, params } as Href) : routeName);
}
