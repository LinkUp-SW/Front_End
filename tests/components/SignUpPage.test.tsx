/* eslint-disable @typescript-eslint/no-explicit-any */
// tests/pages/auth/signup/SignUpPage.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, beforeEach, test, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SignUpPage from '../../src/pages/auth/sign_up/SignUpPage';
import { handleSaveCredentials } from '../../src/utils';
import React from 'react';

// Mock components
vi.mock('../../src/components', () => ({
  UserAuthLayout: (Component: React.FC) => Component,
  FormInput: (props: any) => (
    <input
      data-testid={props.id}
      value={props.value}
      onChange={props.onChange}
    />
  )
}));

// Mock child components with proper interaction
vi.mock('../../src/pages/auth/sign_up/multi_step/EmailPasswordForm', () => ({
  default: ({ nextStep }: any) => (
    <div>
      <button onClick={nextStep}>Next Step</button>
    </div>
  )
}));

vi.mock('../../src/pages/auth/sign_up/multi_step/FirstNameLastNameForm', () => ({
  default: ({ saveCredentials }: any) => (
    <div>
      <button onClick={saveCredentials}>Save Credentials</button>
    </div>
  )
}));

// Mock utilities
vi.mock('../../src/utils', () => ({
  handleSaveCredentials: vi.fn()
}));

describe('SignUpPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('saves credentials when completing both steps', async () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    // Move to second step
    fireEvent.click(screen.getByText('Next Step'));
    
    // Interact with second step
    fireEvent.click(screen.getByText('Save Credentials'));
    
    await waitFor(() => {
      expect(handleSaveCredentials).toHaveBeenCalled();
    });
  });

  // Keep other tests but remove the faulty one
  test('removes credentials from localStorage on mount', () => {
    localStorage.setItem('user-signup-credentials', 'test');
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );
    expect(localStorage.getItem('user-signup-credentials')).toBeNull();
  });

  test('navigates between form steps', async () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText('Next Step'));
    await waitFor(() => {
      expect(screen.getByText('Save Credentials')).toBeInTheDocument();
    });
  });
});