//@ts-nocheck
import { render } from '@testing-library/react-native';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store as ReduxStore } from '../src/redux';

/**
 * Create a mock store with initial state
 */
const RenderWrapper = (component, store = ReduxStore) => {
  return {
    ...render(
      <Provider store={store}>
        <PersistGate persistor={persistor}>{component}</PersistGate>
      </Provider>
    ),
    store,
    persistor
  };
};

/**
 * Wrapper for rendering components with Redux store and persistor for hooks
 */
const RenderWrapperForHooks = ({ children, store }): ReactNode => (
  <Provider store={store ?? ReduxStore}>
    <PersistGate persistor={persistor}>{children}</PersistGate>
  </Provider>
);

export { RenderWrapper, RenderWrapperForHooks };
