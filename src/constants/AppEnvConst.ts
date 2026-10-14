import ExpoConstants from 'expo-constants';

/**
 * A constant freezing object that contains the app value.
 * @type {Object}
 */
export default Object.freeze({
  mobile: 'Mobile',
  isDevelopment:
    __DEV__ ||
    (ExpoConstants.expoConfig?.extra?.EXPO_PUBLIC_ENVIRONMENT ?? 'development') === 'development',
  environment: ExpoConstants.expoConfig?.extra?.EXPO_PUBLIC_ENVIRONMENT ?? 'development',
  sentryUrl: ExpoConstants.expoConfig?.extra?.EXPO_PUBLIC_SENTRY_URL ?? '',
  apiUrl: ExpoConstants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ?? ''
});
