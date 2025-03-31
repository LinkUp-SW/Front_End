import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FirstNameLastNameForm from '../../src/pages/auth/sign_up/multi_step/FirstNameLastNameForm'; // adjust the path as needed
import { toast } from 'sonner';
import React from 'react';
// Mock the toast functions from 'sonner'
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Create a mocked version of useNavigate
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigate,
}));

describe('FirstNameLastNameForm', () => {
  const mockUpdateFields = vi.fn();
  const mockSaveCredentials = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows error when first name is empty', () => {
    render(
      <FirstNameLastNameForm
        firstName=""
        lastName="Doe"
        updateFields={mockUpdateFields}
        saveCredentials={mockSaveCredentials}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(toast.error).toHaveBeenCalledWith("Please enter you First Name");
  });

  it('shows error when last name is empty', () => {
    render(
      <FirstNameLastNameForm
        firstName="John"
        lastName=""
        updateFields={mockUpdateFields}
        saveCredentials={mockSaveCredentials}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(toast.error).toHaveBeenCalledWith("Please enter your Last Name");
  });

  it('calls saveCredentials and navigates when both first and last names are provided', () => {
    render(
      <FirstNameLastNameForm
        firstName="John"
        lastName="Doe"
        updateFields={mockUpdateFields}
        saveCredentials={mockSaveCredentials}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(mockSaveCredentials).toHaveBeenCalled();
    expect(mockedNavigate).toHaveBeenCalledWith("/signup/location");
  });

  it('calls updateFields when the first name input changes', () => {
    render(
      <FirstNameLastNameForm
        firstName="John"
        lastName="Doe"
        updateFields={mockUpdateFields}
        saveCredentials={mockSaveCredentials}
      />
    );
    const firstNameInput = screen.getByPlaceholderText("Enter your First Name");
    fireEvent.change(firstNameInput, { target: { value: "Johnny" } });
    expect(mockUpdateFields).toHaveBeenCalledWith({ firstName: "Johnny" });
  });

  it('calls updateFields when the last name input changes', () => {
    render(
      <FirstNameLastNameForm
        firstName="John"
        lastName="Doe"
        updateFields={mockUpdateFields}
        saveCredentials={mockSaveCredentials}
      />
    );
    const lastNameInput = screen.getByPlaceholderText("Enter your Last Name");
    fireEvent.change(lastNameInput, { target: { value: "Doe Jr." } });
    expect(mockUpdateFields).toHaveBeenCalledWith({ lastName: "Doe Jr." });
  });
});
