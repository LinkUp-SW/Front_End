/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { render, screen,waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LocationPage from '../../src/pages/auth/sign_up/location_page/LocationPage'; // adjust the path as needed
import Cookies from 'js-cookie';
import React from 'react';

// --- Mocks ---

// Mock toast functions from 'sonner'
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock handleSaveCredentials from '../../src/utils'
vi.mock('../../src/utils', () => ({
  handleSaveCredentials: vi.fn(),
}));

// Mock useNavigate from 'react-router-dom'
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigate,
}));

// Mock custom hook to intercept back navigation (no-op for tests)
vi.mock('../../src/hooks/useInterceptBackNavigation', () => ({
  useInterceptBackNavigation: () => {},
}));



// --- Test Suite ---
describe('LocationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    Cookies.remove('linkup_user_data');
    // Override window.location with a writable, configurable property
    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: { replace: vi.fn() },
    });
  });

  it('redirects to "/" if savedCredential is missing', async () => {
    // Render without setting saved credentials in localStorage or cookies.
    render(<LocationPage />);
    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith("/");
    });
  });

  it('renders correctly when savedCredential exists', () => {
    const savedCred = JSON.stringify({ test: 'value' });
    localStorage.setItem('user-signup-credentials', savedCred);
    render(<LocationPage />);
    expect(screen.getByText(/Welcome, What's Your Location/i)).toBeInTheDocument();
  });

});
