jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = { x: 0, y: 0, width: 0, height: 10 };
  return {
    ...jest.requireActual('react-native-safe-area-context'),
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaConsumer: jest.fn(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn(() => inset),
    useSafeAreaFrame: jest.fn(() => frame)
  };
});

jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist');
  return {
    ...real,
    persistReducer: jest.fn().mockImplementation((config, reducers) => reducers)
  };
});

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: (props: any) => props.children
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  DefaultTheme: {
    dark: false,
    colors: {
      primary: '',
      background: '',
      card: '',
      text: '',
      border: '',
      notification: ''
    }
  },
  ThemeProvider: ({ children }: any) => children
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: jest.fn(({ children }) => children),
  PanGestureHandler: jest.fn(({ children }) => children),
  TapGestureHandler: jest.fn(({ children }) => children),
  State: {},
  Directions: {}
}));

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  wrap: jest.fn((component) => component),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  addBreadcrumb: jest.fn(),
  withScope: jest.fn((cb) => cb({ setExtra: jest.fn() })),
  ReactNavigationInstrumentation: jest.fn(),
  ReactNativeTracing: jest.fn()
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
    dismiss: jest.fn(),
    dismissAll: jest.fn(),
    canGoBack: jest.fn(() => true)
  },
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
    dismiss: jest.fn(),
    dismissAll: jest.fn(),
    canGoBack: jest.fn(() => true)
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  useGlobalSearchParams: jest.fn(() => ({})),
  useSegments: jest.fn(() => []),
  usePathname: jest.fn(() => '/'),
  Redirect: jest.fn(() => null),
  Stack: Object.assign(jest.fn(({ children }) => children), {
    Screen: jest.fn(() => null),
    Protected: jest.fn(({ children }) => children)
  }),
  Tabs: Object.assign(jest.fn(({ children }) => children), {
    Screen: jest.fn(() => null)
  }),
  Slot: jest.fn(({ children }) => children),
  Link: jest.fn(({ children }) => children),
  SplashScreen: {
    preventAutoHideAsync: jest.fn(() => Promise.resolve()),
    hideAsync: jest.fn(() => Promise.resolve())
  },
  useNavigationContainerRef: jest.fn(() => ({
    isReady: jest.fn().mockReturnValue(true),
    dispatch: jest.fn(),
    current: null
  }))
}));

const mock = require('react-native-permissions/mock');
jest.mock('react-native-permissions', () => {
  return mock;
});

jest.mock('react-native/Libraries/Utilities/Platform', () => {
  const Platform = jest.requireActual('react-native/Libraries/Utilities/Platform');
  Platform.OS = 'ios';
  Platform.select = jest.fn((obj) => obj.ios || obj.default);
  return Platform;
});

// Mock AppState
jest.mock('react-native', () => {
  const REACT_NATIVE = jest.requireActual('react-native');

  REACT_NATIVE.AppState = {
    addEventListener: jest.fn(() => ({
      remove: jest.fn(),
      change: jest.fn()
    })),
    removeEventListener: jest.fn(),
    currentState: 'active'
  };

  // ✅ Mock Linking
  REACT_NATIVE.Linking = {
    openURL: jest.fn(),
    canOpenURL: jest.fn().mockResolvedValue(true),
    getInitialURL: jest.fn().mockResolvedValue(null),
    addEventListener: jest.fn(() => ({ remove: jest.fn() }))
  };

  REACT_NATIVE.Platform = {
    select: jest.fn()
  };

  REACT_NATIVE.PermissionsAndroid = {
    ...REACT_NATIVE.PermissionsAndroid,
    check: jest.fn(() => new Promise((resolve) => resolve(true))),
    request: jest.fn(() => new Promise((resolve) => resolve('granted')))
  };

  return REACT_NATIVE;
});

jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() }
      },
      addAsyncRequestTransform: jest.fn(),
      addMonitor: jest.fn(),
      addAsyncResponseTransform: jest.fn()
    })),
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    isAxiosError: jest.fn(() => true),
    AxiosError: jest.fn(() => '')
  };
});

/**
 * Example of mocking a native module, notifee in this case
 * */
// jest.mock('@notifee/react-native', () => ({
//   __esModule: true,
//   default: {
//     createChannel: jest.fn().mockResolvedValue('mock-channel-id'),
//     displayNotification: jest.fn(),
//     onForegroundEvent: jest.fn()
//   },
//   EventType: { PRESS: 'PRESS' },
//   AndroidImportance: {
//     HIGH: 'high'
//   }
// }));

// jest.doMock('react-native', () => {
//   return Object.setPrototypeOf(
//     {
//       NativeModules: {
//         ...ReactNative.NativeModules,
//         NotifeeApiModule: {
//           addListener: jest.fn(),
//           eventsAddListener: jest.fn(),
//           eventsNotifyReady: jest.fn(),
//           onForegroundEvent: jest.fn(),
//           displayNotification: jest.fn(),
//           createChannel: jest.fn()
//         }
//       }
//     },
//     ReactNative
//   );
// });

/**
 * Example of mocking a TurboModule
 */
// jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => {
//   const actual = jest.requireActual('react-native/Libraries/TurboModule/TurboModuleRegistry');

//   return {
//     ...actual,
//     getEnforcing: (name: string) => {
//       if (name === 'RNDocumentViewer') {
//         return {
//           open: jest.fn(),
//           close: jest.fn()
//         };
//       }
//       return actual.getEnforcing(name);
//     }
//   };
// });
