// src/components/CustomButton.tsx
import React from "react";

export type CustomButtonProps = {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const BUTTON_BASE_CLASSES =
  "flex items-center justify-center gap-2 flex-grow px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out";

const BUTTON_VARIANTS: Record<NonNullable<CustomButtonProps["variant"]>, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-800 dark:text-white",
  secondary:
    "border-blue-600 text-blue-600 border-2 hover:bg-blue-600 hover:text-white dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300 dark:hover:text-gray-700",
  outline: "border border-gray-300 hover:bg-gray-200 dark:hover:text-black",
};

const CustomButton: React.FC<CustomButtonProps> = ({ variant = "primary", children, ...props }) => {
  return (
    <button className={`${BUTTON_BASE_CLASSES} cursor-pointer ${BUTTON_VARIANTS[variant]}`} {...props}>
      {children}
    </button>
  );
};

export default CustomButton;
