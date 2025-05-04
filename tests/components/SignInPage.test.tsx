/* eslint-disable @typescript-eslint/no-explicit-any */
// tests/components/SignInPage.test.tsx
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, beforeEach, test, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SignInPage from '../../src/pages/auth/sign_in/SignInPage';
import { toast } from 'sonner';
import {  initiateGoogleAuth } from '../../src/endpoints/userAuth';

// --- Mocks for external modules ---

// Mock components used by SignInPage
vi.mock('../../src/components', () => ({
  UserAuthLayout: (Component: React.FC) => Component,
  FormInput: (props: any) => (
    <div>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        type={props.type}
      />
    </div>
  ),
}));

// Mock the custom hook to control submission state
const startSubmittingMock = vi.fn();
const stopSubmittingMock = vi.fn();
vi.mock('../../src/hooks/useFormStatus', () => ({
  useFormStatus: () => ({
    isSubmitting: false,
    startSubmitting: startSubmittingMock,
    stopSubmitting: stopSubmittingMock,
  }),
}));

// Mock error handler utility
vi.mock('../../src/utils/errorHandler', () => ({
  getErrorMessage: (error: any) => error.message || 'error',
}));

// Mock ReCAPTCHA to simulate token generation
// vi.mock('react-google-recaptcha', () => ({
//   default: (props: any) => (
//     <div data-testid="recaptcha-mock">
//       <button onClick={() => props.onChange('mock-token')}>
//         Simulate ReCAPTCHA
//       </button>
//     </div>
//   ),
// }));

// Mock endpoints used in the signin process
vi.mock('../../src/endpoints/userAuth', () => ({
  signin: vi.fn(),
  initiateGoogleAuth: vi.fn(),
}));

// Mock toast functions from 'sonner'
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    promise: vi.fn(),
  },
}));

// --- Test Suite ---
describe('SignInPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Pre-set a localStorage item to test its removal on mount
    localStorage.setItem('user-email', 'dummy@example.com');
    // Override window.location.replace using Object.defineProperty
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { ...window.location, replace: vi.fn() },
    });
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

  test('renders the signin page with all key elements', () => {
    renderComponent();
    expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email or Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Continue with Google/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Sign in/i })
    ).toBeInTheDocument();
  });

  test('removes user-email from localStorage on mount', () => {
    renderComponent();
    expect(localStorage.getItem('user-email')).toBeNull();
  });

  // test('shows error for invalid identifier input', async () => {
  //   renderComponent();
  //   fireEvent.change(screen.getByLabelText(/Email or Phone/i), {
  //     target: { value: 'invalid' },
  //   });
  //   fireEvent.change(screen.getByLabelText(/Password/i), {
  //     target: { value: 'password123' },
  //   });
  //   fireEvent.click(screen.getByText(/Simulate ReCAPTCHA/i));
  //   fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
  //   await waitFor(() => {
  //     expect(toast.error).toHaveBeenCalledWith(
  //       'Please enter a valid email address or phone number.'
  //     );
  //   });
  // });

  // test('shows error when password field is empty', async () => {
  //   renderComponent();
  //   fireEvent.change(screen.getByLabelText(/Email or Phone/i), {
  //     target: { value: 'test@example.com' },
  //   });
  //   // Leave password empty
  //   fireEvent.click(screen.getByText(/Simulate ReCAPTCHA/i));
  //   fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
  //   await waitFor(() => {
  //     expect(toast.error).toHaveBeenCalledWith('Please enter your password');
  //   });
  // });

  // test('shows error when recaptcha token is missing', async () => {
  //   renderComponent();
  //   fireEvent.change(screen.getByLabelText(/Email or Phone/i), {
  //     target: { value: 'test@example.com' },
  //   });
  //   fireEvent.change(screen.getByLabelText(/Password/i), {
  //     target: { value: 'password123' },
  //   });
  //   // Do not simulate recaptcha token generation
  //   fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
  //   await waitFor(() => {
  //     expect(toast.error).toHaveBeenCalledWith('Please complete the captcha.');
  //   });
  // });



  test('triggers initiateGoogleAuth when the Google button is clicked', () => {
    renderComponent();
    const googleButton = screen.getByRole('button', {
      name: /Continue with Google/i,
    });
    fireEvent.click(googleButton);
    expect(initiateGoogleAuth).toHaveBeenCalled();
  });
});
