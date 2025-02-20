// src/store.ts

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counter/counterSlice";
import themeReducer from "./slices/theme/themeSlice"; // Import theme slice

// For now, we’ll set up an empty reducer. Later, you can add slices or combine reducers.
export const store = configureStore({
  reducer: {
    // Add your reducers here. Example:
    // counter: counterReducer,
    counter: counterReducer,
    theme: themeReducer, // Add theme reducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
