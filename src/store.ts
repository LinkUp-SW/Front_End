// src/store.ts

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counter/counterSlice';

// For now, we’ll set up an empty reducer. Later, you can add slices or combine reducers.
export const store = configureStore({
  reducer: {
    // Add your reducers here. Example:
    // counter: counterReducer,
    counter: counterReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
