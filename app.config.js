import { defineProGuardRules, getEnvironmentConfig } from './buildconfig';

/* eslint-disable require-jsdoc */
const defineConfig = ({ config }) => {
  let APP_ENV = process.env.NODE_ENV;

  const { appName, bundleIdentifier } = getEnvironmentConfig(APP_ENV);

  return {
    ...config,
    name: appName,
    slug: 'vixelStudio',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './src/assets/icons/appIcon.png',
    scheme: 'vixelstudio',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './src/assets/images/splashScreen.png',
      resizeMode: 'contain'
    },
    ios: {
      bundleIdentifier: bundleIdentifier,
      infoPlist: {
        NSCameraUsageDescription: 'This app requires to access your photo library'
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/icons/adaptiveIcon.png',
        backgroundColor: '#ffffff'
      },
      package: bundleIdentifier,
      permissions: ['CAMERA'],
      intentFilters: [
        {
          action: 'VIEW',
          data: [
            {
              scheme: 'vixelstudio'
            }
          ],
          category: ['BROWSABLE', 'DEFAULT']
        }
      ]
    },
    web: {
      bundler: 'metro',
      output: 'static'
    },
    plugins: [
      'expo-localization',
      'expo-asset',
      'expo-font',
      'expo-router',
      [
        'expo-build-properties',
        {
          android: {
            minSdkVersion: 30,
            enableProguardInReleaseBuilds: true,
            extraProguardRules: defineProGuardRules(bundleIdentifier)
          },
          ios: {
            deploymentTarget: '16.0'
          }
        }
      ],
      [
        'react-native-permissions',
        {
          iosPermissions: ['Camera']
        }
      ],
      ['./withCustomSigning']
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: '062035db-de16-45de-8f9f-d505400fa91e'
      },
      ...process.env
    }
  };
};

export default defineConfig;
