//utils/index.ts

import { openModal } from "@/slices/modal/modalSlice";
import { SkillResponse, UserStarterInterface } from "@/types";
import React from "react";
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

export function isSkillResponse(obj: unknown): obj is SkillResponse {
  if (typeof obj === "object" && obj !== null) {
    const record = obj as Record<string, unknown>;
    return (
      typeof record["_id"] === "string" && typeof record["name"] === "string"
    );
  }
  return false;
}

type RelationKey = "licenses" | "educations" | "experiences";

export function buildSkillNamesMap(
  skills: Array<
    { _id: string; name: string } & { [K in RelationKey]: { _id: string }[] }
  >,
  relation: RelationKey
): Record<string, string[]> {
  return skills.reduce<Record<string, string[]>>((map, skill) => {
    for (const { _id } of skill[relation]) {
      (map[_id] ??= []).push(skill.name);
    }
    return map;
  }, {});
}

export const hasRichFormatting = (text: string): boolean => {
  const richFormatRegex =
    /(\*[^*]+\*)|(-[^-]+-)|(~[^~]+~)|(@[^:]+:[A-Za-z0-9_-]+\^)/;
  return richFormatRegex.test(text);
};

export async function compressDataUrl(
  dataUrl: string,
  maxW = 800,
  maxH = 800,
  quality = 0.7
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // calculate target size
      let { width, height } = img;
      if (width > maxW || height > maxH) {
        if (width / height > maxW / maxH) {
          height = Math.round(height * (maxW / width));
          width = maxW;
        } else {
          width = Math.round(width * (maxH / height));
          height = maxH;
        }
      }
      // draw to canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      // export blob
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject("toBlob failed")),
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => reject("Image load error");
    img.src = dataUrl;
  });
}

export const validateName = (name: string): boolean => {
  const regex = /^[a-zA-Z]{1,15}$/;
  return regex.test(name);
};

export const splitHeadline = (text: string) => {
  const words = text.split(" "); // Split by spaces to check each word/substring

  return words.map((word, index) => {
    if (word.length > 10) {
      // Apply `break-all` for words longer than 15 characters
      return React.createElement(
        "span",
        { key: index, className: "break-all" },
        word + " "
      );
    } else {
      // Apply `break-words` for shorter words
      return React.createElement(
        "span",
        { key: index, className: "break-words" },
        word + " "
      );
    }
  });
};



const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const units: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: 'year',   ms: 1000 * 60 * 60 * 24 * 365 },
  { unit: 'month',  ms: 1000 * 60 * 60 * 24 * 30 },
  { unit: 'week',   ms: 1000 * 60 * 60 * 24 * 7 },
  { unit: 'day',    ms: 1000 * 60 * 60 * 24 },
  { unit: 'hour',   ms: 1000 * 60 * 60 },
  { unit: 'minute', ms: 1000 * 60 },
  { unit: 'second', ms: 1000 },
];

export function timeAgo(isoTimestamp: string): string {
  const past = new Date(isoTimestamp).getTime();
  const now  = Date.now();
  const diff = now - past;

  for (const { unit, ms } of units) {
    if (diff >= ms) {
      const value = Math.floor(diff / ms);
      // negative because IntlRelativeTimeFormat expects how far *future* or *past*
      return rtf.format(-value, unit);
    }
  }
  return 'just now';
}