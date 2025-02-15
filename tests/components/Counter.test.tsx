import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../../src/slices/counter/counterSlice';
import {Counter} from '../../src/components';
import React from 'react';
import { expect, test } from 'vitest';
import { clickButton } from '../utils/userEventHelper';

// Utility function to render with Redux store
const renderWithRedux = (component: React.ReactNode) => {
  const store = configureStore({ reducer: { counter: counterReducer } });
  return render(<Provider store={store}>{component}</Provider>);
};

test('renders Counter component and interacts with buttons', async () => {
  renderWithRedux(<Counter />);

  // Ensure counter starts at 0
  expect(screen.getByText(/Counter: 0/i)).toBeInTheDocument();

  // Click Increment button
  await clickButton('Increment');
  expect(screen.getByText(/Counter: 1/i)).toBeInTheDocument();

  // Click Decrement button
  await clickButton('Decrement');
  expect(screen.getByText(/Counter: 0/i)).toBeInTheDocument();

  // Click "Increment by 5" button
  await clickButton('Increment by 5');
  expect(screen.getByText(/Counter: 5/i)).toBeInTheDocument();
});
