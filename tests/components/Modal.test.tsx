// Modal.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import modalReducer from '../../src/slices/modal/modalSlice'; // Adjust path if needed
import { Modal } from '../../src/components'; // Adjust path if needed
import React from 'react';
import { describe, test, expect } from 'vitest';

// Combine your slice reducers into a root reducer
const rootReducer = combineReducers({
  modal: modalReducer,
});

// Define the RootState based on the root reducer
type RootState = ReturnType<typeof rootReducer>;

// Instead of PreloadedState, we use Partial<RootState>
interface ExtendedRenderOptions {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof configureStore>;
}

// A helper function to render with Redux Provider using our combined reducer and typed state
function renderWithRedux(
  ui: React.ReactElement,
  {
    preloadedState,
    store = configureStore({
      reducer: rootReducer,
      preloadedState,
    }),
  }: ExtendedRenderOptions = {}
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
}

describe('Modal Component', () => {
  test('does not render when modal is closed', () => {
    // Preload the state with modal closed
    const preloadedState: Partial<RootState> = { modal: { isOpen: false, modalType: null } };
    renderWithRedux(<Modal />, { preloadedState });
    // The modal content "Edit About" should not be in the document
    expect(screen.queryByText(/Edit About/i)).not.toBeInTheDocument();
  });

  test('renders modal content when modal is open', async () => {
    // Preload the state with modal open and type "about"
    const preloadedState: Partial<RootState> = { modal: { isOpen: true, modalType: 'about' } };
    renderWithRedux(<Modal />, { preloadedState });
    // Wait for the enter animation to complete and the content to be rendered
    await waitFor(
      () => {
        expect(screen.getByText(/Edit About/i)).toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  test('clicking on overlay closes the modal', async () => {
    // Start with the modal open
    const preloadedState: Partial<RootState> = { modal: { isOpen: true, modalType: 'about' } };
    const { container } = renderWithRedux(<Modal />, { preloadedState });
    // Ensure the modal content is rendered
    expect(screen.getByText(/Edit About/i)).toBeInTheDocument();
    // Simulate a click on the overlay (assuming the overlay is the first child)
    fireEvent.click(container.firstChild as HTMLElement);
    // Wait for the exit animation to complete (300ms) and the modal to unmount.
    await waitFor(
      () => {
        expect(screen.queryByText(/Edit About/i)).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });
});
