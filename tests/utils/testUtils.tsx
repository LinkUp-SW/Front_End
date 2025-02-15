import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import counterReducer from '../../src/slices/counter/counterSlice';
import { ReactNode } from 'react';
import React from 'react';

// Custom render function with Redux store
export const renderWithRedux = (
  ui: ReactNode,
  {
    preloadedState = {},
    store = configureStore({ reducer: { counter: counterReducer }, preloadedState }),
  }: { preloadedState?: unknown; store?: EnhancedStore } = {}
) => {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
};
