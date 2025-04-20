//utils/index.ts

import { openModal } from "@/slices/modal/modalSlice";
import { UserStarterInterface } from "@/types";
import type { Area } from "react-easy-crop";

// Example utility function to convert an array of strings to lowercase
export const convertStringsArrayToLowerCase = (arr: string[]): string[] => {
  return arr.map((el) => el.toLocaleLowerCase());
};

export const validateEmail = (email: string): boolean => {
  // Check each character to ensure it is within the ASCII range (0-127)
  for (let i = 0; i < email.length; i++) {
    if (email.charCodeAt(i) > 127) {
      return false;
    }
  }

  // Strict email validation regex:
  // (?=.{1,254}$)         --> Total length of email must be 1 to 254 characters.
  // (?=.{1,64}@)          --> Local part (before the @) must be 1 to 64 characters.
  // [A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+
  //                        --> Valid characters for the local part.
  // (?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*
  //                        --> Allows dot-separated parts in the local part.
  // @                     --> The @ symbol.
  // (?:(?!-)[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,})
  //                        --> Domain part: labels can’t start with a hyphen, and the TLD must be at least 2 letters.

  const emailRegex =
    /^(?=.{1,254}$)(?=[^@]{1,64}@)[a-zA-Z0-9][a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]*(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:(?=[a-z0-9]{1,63}\.)[a-z0-9](?:[a-z0-9]{0,61}[a-z0-9])?\.)+(?=[a-z0-9]{2,63}$)[a-z0-9]{2,63}$/i;

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

export const handleSaveCredentials = (
  userCredentials: Partial<UserStarterInterface>
) => {
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

/**
 * Converts an ISO date string to a human-readable format.
 * Example: "1990-01-01T00:00:00.000Z" becomes "january 1 1990".
 *
 * @param isoDate - The ISO date string.
 * @returns The formatted date string in lowercase.
 */
export function formatIsoDateToHumanReadable(isoDate: string): string {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  let formattedDate = date.toLocaleDateString("en-US", options);
  // Remove comma and convert to lowercase to match the example format.
  formattedDate = formattedDate.replace(",", "").toLowerCase();
  return formattedDate;
}

export const formatExperienceDate = (date: Date): string | null => {
  if (!date) return null;
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date
    .toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    .toLowerCase();
};

export function extractMonthAndYear(date?: Date): {
  month: string;
  year: string;
} {
  if (!date) return { month: "", year: "" };
  const d = new Date(date);
  return { month: String(d.getMonth() + 1), year: String(d.getFullYear()) };
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject("Failed to convert file to base64");
      }
    };

    reader.onerror = () => {
      reject("Error reading file");
    };

    reader.readAsDataURL(file); // Reads the file and converts it to base64
  });
};

export default fileToBase64;

export const parseURI = (file: Blob): Promise<string> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

export const getDataBlob = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    const blob = await response.blob();
    const uri = await parseURI(blob);
    return uri;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Avoid CORS issues for external images.
    image.src = url;
  });

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not found");
  }

  // Set the canvas to the size of the cropped area.
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image into the canvas.
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        // Return a URL or convert to file as needed.
        const croppedImageUrl = URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      } else {
        reject(new Error("Canvas is empty"));
      }
    }, "image/jpeg");
  });
}
