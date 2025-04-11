import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import EmailPasswordForm from '../../src/pages/auth/sign_up/multi_step/EmailPasswordForm';
import { toast } from 'sonner';
import { verifyEmail, initiateGoogleAuth } from '../../src/endpoints/userAuth';
import React from 'react';

vi.mock('../../src/endpoints/userAuth', () => ({
  verifyEmail: vi.fn().mockResolvedValue({}),
  initiateGoogleAuth: vi.fn()
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

describe('EmailPasswordForm', () => {
  const mockNext = vi.fn();
  const mockUpdate = vi.fn();

  test('validates empty email', async () => {
    render(<EmailPasswordForm email="" password="" updateFields={mockUpdate} nextStep={mockNext} />);
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('please enter your email'));
  });

  test('validates invalid email format', async () => {
    render(<EmailPasswordForm email="bad-email" password="" updateFields={mockUpdate} nextStep={mockNext} />);
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('please enter a valid email '));
  });

  test('validates password requirements', async () => {
    render(<EmailPasswordForm email="test@example.com" password="weak" updateFields={mockUpdate} nextStep={mockNext} />);
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  test('calls verifyEmail on valid input', async () => {
    render(<EmailPasswordForm email="test@example.com" password="ValidPass123!" updateFields={mockUpdate} nextStep={mockNext} />);
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      expect(verifyEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  test('handles Google auth', () => {
    render(<EmailPasswordForm email="" password="" updateFields={mockUpdate} />);
    fireEvent.click(screen.getByText('Continue with Google'));
    expect(initiateGoogleAuth).toHaveBeenCalled();
  });
});