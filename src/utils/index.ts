//utils/index.ts

import { openModal } from "@/slices/modal/modalSlice";
import { UserStarterInterface } from "@/types";

// Example utility function to convert an array of strings to lowercase
export const convertStringsArrayToLowerCase = (arr: string[]): string[] => {
  return arr.map((el) => el.toLocaleLowerCase());
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one digit";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain at least one special character";
  }
  return null;
};

// Annotate the function so TypeScript can infer the generic type properly.
export const handleOpenModalType = <T>(
  modalType: string,
  modalData: T | null = null
): ReturnType<typeof openModal> => {
  return openModal({ modalType, modalData });
};

export const handleSaveCredentials = (userCredentials:Partial<UserStarterInterface>) => {
    const savedCredential = localStorage.getItem("user-signup-credentials");

    if (!savedCredential) {
      const toBeStoredUserCredentials = JSON.stringify(userCredentials);
      return localStorage.setItem(
        "user-signup-credentials",
        toBeStoredUserCredentials
      );
    }

    // Convert the string from localStorage into an object
    const parsedCredentials = JSON.parse(savedCredential);
    // Merge the parsed credentials with the new userCredentials
    const newToBeStoredCredentials = {
      ...parsedCredentials,
      ...userCredentials,
    };

    // Save the updated credentials back to localStorage as a string
    localStorage.setItem(
      "user-signup-credentials",
      JSON.stringify(newToBeStoredCredentials)
    );
  };

